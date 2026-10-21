// Students & Families page — simple family password screen.
// Note: this only hides the page from casual visitors; it is not real security.
// To change the password, edit FAMILY_PASSWORD below (lowercase).
(function () {
  var FAMILY_PASSWORD = 'dream1';
  var KEY = 'dtkd-students-ok';
  var gate = document.getElementById('gate');
  var members = document.getElementById('members');
  var form = document.getElementById('gate-form');
  var input = document.getElementById('gate-pw');
  var error = document.getElementById('gate-error');

  function unlock() {
    gate.hidden = true;
    members.hidden = false;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }
  try { if (sessionStorage.getItem(KEY) === '1') unlock(); } catch (e) {}

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (String(input.value).trim().toLowerCase() === FAMILY_PASSWORD) {
      error.hidden = true;
      unlock();
      window.scrollTo(0, 0);
    } else {
      error.hidden = false;
      input.select();
    }
  });
})();
