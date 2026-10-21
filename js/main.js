// Dream Taekwondo — site scripts (slideshow + request forms)
(function () {
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
