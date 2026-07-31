/* D/LIGHT GYM 体験LP — 最小限のUI挙動 */
(function () {
  'use strict';

  /* ヘッダー：ヒーロー上は透過、スクロールで白背景に */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  var mcta = document.querySelector('.mcta');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var heroH = hero ? hero.offsetHeight - 80 : 200;
    if (header) header.classList.toggle('header--over', y < heroH);
    /* スマホ固定CTAはヒーローを通り過ぎてから出す */
    if (mcta) mcta.classList.toggle('is-on', y > 420);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* スクロール表示 */
  var targets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* FAQ アコーディオン */
  document.querySelectorAll('.acc__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc__item');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* 年号 */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
