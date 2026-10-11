(function () {
  var root = document.documentElement;

  // Theme (saved preference, else system)
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var menu = document.getElementById('menu');
  var btn = document.getElementById('menuBtn');
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); btn.setAttribute('aria-expanded', false); });
  });

  // Profile photo lightbox (built here so it works with or without markup in the HTML)
  var av = document.getElementById('avatar');
  if (av) {
    var lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox'; lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Profile photo'); lb.setAttribute('aria-hidden', 'true');
      lb.appendChild(document.createElement('img'));
      document.body.appendChild(lb);
    }
    var big = lb.querySelector('img');
    var setLb = function (on) {
      if (on) { big.src = av.currentSrc || av.src; big.alt = av.alt; }
      lb.classList.toggle('open', on); lb.setAttribute('aria-hidden', String(!on));
    };
    av.addEventListener('click', function () { setLb(true); });
    av.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLb(true); } });
    lb.addEventListener('click', function () { setLb(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setLb(false); });
  }

  // Flip cards
  document.querySelectorAll('.flip').forEach(function (f) {
    function toggle() { var on = f.classList.toggle('flipped'); f.setAttribute('aria-pressed', on); }
    f.addEventListener('click', toggle);
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // Typed text
  var phrases = ['Java • Spring Boot • REST APIs', 'Kafka message streaming', 'Python Flask data analysis', 'Observability with Grafana & Prometheus'];
  var el = document.getElementById('typed'), p = 0, c = 0, del = false;
  function type() {
    var t = phrases[p];
    el.textContent = t.slice(0, c);
    if (!del && c === t.length) { del = true; return setTimeout(type, 1500); }
    if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
    c += del ? -1 : 1;
    setTimeout(type, del ? 35 : 70);
  }
  type();

  // Scroll reveal + counters
  function count(n) {
    var target = +n.dataset.count, suffix = n.dataset.suffix || '', cur = 0;
    var step = Math.max(1, Math.ceil(target / 30));
    var iv = setInterval(function () {
      cur = Math.min(target, cur + step);
      n.textContent = cur + suffix;
      if (cur >= target) clearInterval(iv);
    }, 40);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });

  // Active nav link + progress bar
  var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var bar = document.getElementById('progress');
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    var y = window.scrollY + 120;
    sections.forEach(function (s, i) {
      links[i].classList.toggle('active', s.offsetTop <= y && s.offsetTop + s.offsetHeight > y);
    });
  }, { passive: true });
})();