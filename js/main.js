// Dream Taekwondo — site scripts (slideshow + request forms)
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
        status.textContent = 'Online requests are not connected yet. Please call us at 631-368-7458.';
        return;
      }
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            status.className = 'form-status is-ok';
            status.textContent = 'Thank you! We received your request and will contact you soon.';
          } else {
            throw new Error('failed');
          }
        })
        .catch(function () {
          status.className = 'form-status is-error';
          status.textContent = 'Sorry, something went wrong. Please call us at 631-368-7458.';
        })
        .finally(function () { btn.disabled = false; });
    });
  });
})();


// Hidden staff shortcut: press and hold the © in the footer for 2 seconds.
// When it turns red, let go -> the studio dashboard opens in a new tab.
(function () {
  var el = document.querySelector('.admin-tap');
  if (!el) return;
  var URL = 'https://dream-tkd.web.app/';
  var timer = null, ready = false;
  function reset() { if (timer) clearTimeout(timer); timer = null; ready = false; el.style.color = ''; }
  el.addEventListener('pointerdown', function () {
    reset();
    timer = setTimeout(function () { ready = true; el.style.color = '#C8102E'; }, 2000);
  });
  el.addEventListener('pointerup', function () {
    var go = ready;
    reset();
    if (go) {
      var w = window.open(URL, '_blank');
      if (w) { w.opener = null; } else { window.location.href = URL; } // popup blocked -> open here instead
    }
  });
  ['pointerleave', 'pointercancel'].forEach(function (t) { el.addEventListener(t, reset); });
  el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
})();
