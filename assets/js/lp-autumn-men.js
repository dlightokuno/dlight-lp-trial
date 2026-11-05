/* 秋の疲労回復LP・男性向け：スマホ固定CTA */
(function () {
  'use strict';

  /* ファーストビューを過ぎたら出す */
  var mcta = document.querySelector('[data-mcta]');
  var hero = document.querySelector('.hero');
  if (mcta && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      mcta.classList.toggle('is-on', !es[0].isIntersecting);
    }).observe(hero);
  } else if (mcta) {
    mcta.classList.add('is-on');
  }
})();
