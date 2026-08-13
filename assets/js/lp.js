/* D/LIGHT GYM 体験LP — 最小限のUI挙動 */
(function () {
  'use strict';

  /* ヘッダー：ヒーロー上は透過、スクロールで白背景に */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  var mcta = document.querySelector('.mcta');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var heroH = hero ? hero.offsetHeight : 600;
    /* ヘッダーはヒーローの上だけ透過 */
    if (header) header.classList.toggle('header--over', y < heroH - 80);
    /* スマホ固定CTAは、ヒーローのCTAが画面から消えるあたりで出す
       （固定値だとヒーローの高さが変わったときにボタンが二重に見える） */
    if (mcta) mcta.classList.toggle('is-on', y > heroH * 0.6);
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

  /* ---------------------------------------------------------
     流入元（utm_* / gclid / fbclid）を予約サイトへ引き継ぐ

     Square は別ドメインなので、そのままだと「どの広告から来た予約か」が
     予約実績側で一切わからない。着地時のパラメータを保存し、
     Square へのリンクに付け直す。あわせて CTA の位置も付けるので、
     Square 側の記録と突き合わせれば流入元まで辿れる。

     ※ Square が未知のクエリを無視するか、エラーにするかは要実機確認。
        もし予約ページが開かない場合は、この処理を丸ごと外してよい。
     --------------------------------------------------------- */
  var TRACK_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

  function readSource() {
    var q = new URLSearchParams(location.search), found = {};
    TRACK_KEYS.forEach(function (k) { if (q.get(k)) found[k] = q.get(k); });
    try {
      if (Object.keys(found).length) {
        sessionStorage.setItem('dl_src', JSON.stringify(found));   // 回遊しても保持
      } else {
        var saved = sessionStorage.getItem('dl_src');
        if (saved) found = JSON.parse(saved);
      }
    } catch (e) { /* プライベートモード等では保存できない。付与だけ行う */ }
    return found;
  }

  var src = readSource();

  document.querySelectorAll('a[href*="book.squareup.com"]').forEach(function (a) {
    var url;
    try { url = new URL(a.href); } catch (e) { return; }
    Object.keys(src).forEach(function (k) { url.searchParams.set(k, src[k]); });
    /* ページ内のどのボタンから飛んだか */
    var pos = a.closest('.mcta') ? 'mobile_bar'
            : a.closest('.header') ? 'header'
            : a.closest('.hero') ? 'hero'
            : a.closest('#results') ? 'results'
            : a.closest('#trial') ? 'trial'
            : a.closest('#price') ? 'price'
            : a.closest('.cta-band') ? 'cta_band' : 'body';
    url.searchParams.set('lp_cta', pos);
    a.href = url.toString();
  });
})();
