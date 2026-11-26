(function () {
  var root = document.documentElement;

  // theme (remembered, falls back to system preference)
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'light') root.setAttribute('data-theme', 'light');
  document.getElementById('theme').addEventListener('click', function () {
    var light = root.getAttribute('data-theme') === 'light';
    if (light) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'light');
    try { localStorage.setItem('theme', light ? 'dark' : 'light'); } catch (e) {}
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // scroll reveal with small stagger inside groups
  var items = document.querySelectorAll('.reveal');
  items.forEach(function (el, i) {
    var siblings = el.parentElement.querySelectorAll(':scope > .reveal');
    var idx = Array.prototype.indexOf.call(siblings, el);
    el.style.setProperty('--d', Math.min(idx, 4) * 0.09 + 's');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // progress bar + nav behaviour
  var bar = document.querySelector('.progress');
  var nav = document.querySelector('.nav');
  var lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    nav.classList.toggle('scrolled', y > 20);
    nav.classList.toggle('hide', y > lastY && y > 400);
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // custom cursor + magnetic buttons (fine pointers only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cur = document.querySelector('.cursor');
    var x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) { tx = e.clientX - 7; ty = e.clientY - 7; });
    (function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      cur.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur.classList.add('big'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('big'); });
    });
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }
})();
