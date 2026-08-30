/* D/LIGHT GYM 体験LP ＜B案＞ — UI挙動
   A案(lp.js)とはクラス名が違うので別ファイルにしている。 */
(function () {
  'use strict';

  /* スマホ固定CTA：ファーストビューを抜けたら出す */
  var mcta = document.querySelector('.mcta');
  var fv = document.querySelector('.fv');
  function onScroll() {
    if (!mcta) return;
    var h = fv ? fv.offsetHeight : 600;
    mcta.classList.toggle('is-on', (window.scrollY || window.pageYOffset) > h * 0.65);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* スクロール表示 */
  var t = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    t.forEach(function (x) { io.observe(x); });
  } else { t.forEach(function (x) { x.classList.add('is-in'); }); }

  /* FAQ */
  document.querySelectorAll('.acc__q').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.closest('.faq__i').classList.toggle('is-open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* 見出しの「残り◯ヶ月」を今日の日付から入れ直す。
     手で書いたままだと月をまたいだ瞬間に嘘になるため。
     当月は数えない（8月なら9〜12月で4ヶ月）。12月だけは0にせず1と出す。 */
  document.querySelectorAll('[data-months-left]').forEach(function (e) {
    e.textContent = Math.max(1, 11 - new Date().getMonth());
  });

  document.querySelectorAll('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* 流入元（utm_* / gclid / fbclid）を Square の予約URLへ引き継ぐ。
     どちらのLPから予約されたかを分けるため lp_ver=b も付ける。 */
  var KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
  var q = new URLSearchParams(location.search), src = {};
  KEYS.forEach(function (k) { if (q.get(k)) src[k] = q.get(k); });
  try {
    if (Object.keys(src).length) sessionStorage.setItem('dl_src', JSON.stringify(src));
    else { var s = sessionStorage.getItem('dl_src'); if (s) src = JSON.parse(s); }
  } catch (e) { /* プライベートモードでは保存できない。付与だけ行う */ }

  document.querySelectorAll('a[href*="book.squareup.com"]').forEach(function (a) {
    var url; try { url = new URL(a.href); } catch (e) { return; }
    Object.keys(src).forEach(function (k) { url.searchParams.set(k, src[k]); });
    var sec = a.closest('section[id]');
    url.searchParams.set('lp_cta', a.closest('.mcta') ? 'mobile_bar'
      : a.closest('.hd') ? 'header'
      : a.closest('.fv') ? 'hero'
      : a.closest('.cta') ? 'cta_band'
      : sec ? sec.id : 'body');
    url.searchParams.set('lp_ver', 'b');
    a.href = url.toString();
  });
})();

/* ---------- ヘッダーの高さを実測して CSS に渡す ----------
   ヘッダーは固定配置なので、ファーストビューの写真は自力でその高さぶん
   下がる必要がある。ところがヘッダーの高さは中身の折り返しで 69px〜91px の
   間で変わり、折り返す幅は端末の文字サイズ設定でも動く。メディアクエリで
   決め打ちすると必ずどこかの幅で「写真がヘッダーの裏に潜る」か「上に白い帯が
   残る」になるので、実測値を --hd-h に入れて lp-b.css に使わせている。
   フォントが後から届くと高さが変わるので、読み込み後にもう一度測る。 */
(function () {
  var hd = document.querySelector('.hd');
  if (!hd) return;
  function apply() {
    document.documentElement.style.setProperty(
      '--hd-h', Math.ceil(hd.getBoundingClientRect().height) + 'px');
  }
  apply();
  addEventListener('resize', apply, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
})();
