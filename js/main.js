// Dream Taekwondo — site scripts (slideshow + request forms)
// Analytics helper: safe no-op if Google Analytics is blocked
function track(name, params) { try { if (window.gtag) gtag('event', name, params || {}); } catch (e) {} }

// Count key clicks: email links, free-trial buttons, calendar subscribe, Google reviews
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a');
  if (!a) return;
  var href = a.getAttribute('href') || '';
  if (href.indexOf('mailto:') === 0) track('email_click', { link_text: a.textContent.trim().slice(0, 60) });
  else if (/#trial$/.test(href)) track('trial_button_click', { link_text: a.textContent.trim().slice(0, 60) });
  else if (href.indexOf('calendar.google.com') !== -1) track('calendar_subscribe_click');
  else if (href.indexOf('google.com/search') !== -1) track('google_reviews_click');
  else if (href.indexOf('#book') !== -1) track('party_button_click');
}, true);

(function () {
  // ----- Mobile menu button -----
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('.menu-toggle');
  if (header && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    header.querySelectorAll('nav a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ----- Home hero slideshow: photos fade every 6s, message stays put -----
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = hero.querySelectorAll('.slide');
    var dots = hero.querySelectorAll('.slide-dot');
    var toggle = hero.querySelector('.slide-toggle');
    var current = 0;
    var timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(n) {
      current = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('is-active', i === current);
        s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function play() {
      stop();
      timer = setInterval(function () { show(current + 1); }, 6000);
      toggle.classList.remove('is-paused');
      toggle.setAttribute('aria-label', 'Pause slideshow');
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      toggle.classList.add('is-paused');
      toggle.setAttribute('aria-label', 'Play slideshow');
    }
    dots.forEach(function (d) {
      d.addEventListener('click', function () { show(Number(d.getAttribute('data-slide'))); });
    });
    toggle.addEventListener('click', function () { timer ? stop() : play(); });
    show(0);
    if (reduce) { stop(); } else { play(); }
  }

  // ----- Request forms (free trial + party) -> emailed via Web3Forms -----
  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      var key = form.querySelector('input[name="access_key"]').value;
      if (!key || key.indexOf('YOUR_') === 0) {
        status.className = 'form-status is-error';
        status.textContent = 'Online requests are not connected yet. Please email us at usdreamtkd@gmail.com.';
        return;
      }
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) {
            var subj = (form.querySelector('input[name="subject"]') || {}).value || '';
            track(/party/i.test(subj) ? 'party_request' : 'trial_request', { form_name: subj });
            form.reset();
            status.className = 'form-status is-ok';
            status.textContent = 'Thank you! We received your request and will contact you soon.';
          } else {
            throw new Error('failed');
          }
        })
        .catch(function () {
          status.className = 'form-status is-error';
          status.textContent = 'Sorry, something went wrong. Please email us at usdreamtkd@gmail.com.';
        })
        .finally(function () { btn.disabled = false; });
    });
  });
})();


// Hidden staff shortcut: press and hold "© 2026 Dream Taekwondo" in the footer for 2 seconds.
// When it turns red, let go -> the studio dashboard opens in a new tab.
(function () {
  var el = document.querySelector('.admin-tap');
  if (!el) return;
  var URL = 'https://dream-tkd.web.app/';
  var timer = null, ready = false;
  function reset() { if (timer) clearTimeout(timer); timer = null; ready = false; el.style.color = ''; }
  function down(e) {
    if (e.type === 'touchstart') e.preventDefault(); // stop iPhone text-selection / magnifier
    reset();
    timer = setTimeout(function () { ready = true; el.style.color = '#C8102E'; }, 2000);
  }
  function up(e) {
    var go = ready;
    reset();
    if (!go) return;
    if (e.type === 'touchend') e.preventDefault();
    var w = window.open(URL, '_blank');
    if (w) { w.opener = null; } else { window.location.href = URL; } // popup blocked -> open here
  }
  el.addEventListener('touchstart', down, { passive: false });
  el.addEventListener('touchend', up, { passive: false });
  el.addEventListener('touchcancel', reset);
  el.addEventListener('mousedown', down);
  el.addEventListener('mouseup', up);
  el.addEventListener('mouseleave', reset);
  el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
})();

// Reviews carousel: 3 at a time on desktop (1 on phones), slides every 5s, random order each visit
(function () {
  var box = document.querySelector('.reviews');
  if (!box) return;
  var items = Array.prototype.slice.call(box.querySelectorAll('figure'));
  for (var i = items.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)); var t = items[i]; items[i] = items[k]; items[k] = t; }
  box.classList.add('rv-on');
  var track = document.createElement('div'); track.className = 'rv-track';
  items.forEach(function (f) { f.hidden = false; track.appendChild(f); });
  box.appendChild(track);
  var n = items.length, idx = 0, timer = null, per = 3;
  var dots = document.createElement('div'); dots.className = 'rv-dots';
  box.parentNode.insertBefore(dots, box.nextSibling);
  function perView() { return window.innerWidth <= 760 ? 1 : 3; }
  function build() {
    per = perView();
    track.querySelectorAll('.rv-clone').forEach(function (c) { c.remove(); });
    for (var c = 0; c < per; c++) { var cl = items[c].cloneNode(true); cl.classList.add('rv-clone'); cl.setAttribute('aria-hidden', 'true'); track.appendChild(cl); }
    box.style.setProperty('--per', per);
    dots.innerHTML = '';
    items.forEach(function (_, d) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show review ' + (d + 1)); b.onclick = function () { go(d); restart(); }; dots.appendChild(b); });
    go(idx % n, true);
  }
  function go(to, instant) {
    idx = to;
    var step = track.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    track.style.transition = instant ? 'none' : '';
    track.style.transform = 'translateX(' + (-idx * step) + 'px)';
    Array.prototype.forEach.call(dots.children, function (b, d) { b.classList.toggle('is-active', d === idx % n); });
  }
  track.addEventListener('transitionend', function () { if (idx >= n) go(idx - n, true); });
  function next() { go(idx + 1); }
  function restart() { if (timer) clearInterval(timer); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(next, 5000); }
  box.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
  box.addEventListener('mouseleave', restart);
  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; if (timer) clearInterval(timer); }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (dx < -40) next(); else if (dx > 40) go((idx % n + n - 1) % n);
    restart();
  }, { passive: true });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200); });
  build(); restart();
})();
