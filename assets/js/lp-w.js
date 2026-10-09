/* =========================================================
   D/LIGHT GYM ／ 40代女性向けLP（women.html 専用）の挙動

   index.html（B案・lp-b.js）とはクラス名が違うので別ファイルにしている。
   依存ライブラリなし。読み込みは <script defer> の1本だけ。
   ========================================================= */
(function () {
  'use strict';

  /* ---------- スマホ下部の固定CTA ----------
     ファーストビューの中にCTAがあるので、そこを見ている間は出さない。
     写真の下端を少し過ぎたあたり（FVの40%、または320pxの短いほう）で出す。
     ★本文やフッターを隠さないための下余白は lp-w.css 側（body の padding-bottom）。 */
  var mcta = document.querySelector('.mcta');
  var fv = document.querySelector('.fv');
  function onScroll() {
    if (!mcta) return;
    var h = fv ? fv.offsetHeight : 600;
    var trigger = Math.min(320, h * 0.4);
    mcta.classList.toggle('is-on', (window.scrollY || window.pageYOffset) > trigger);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- FAQの開閉 ----------
     見た目の切り替えはCSS（.faq__i.is-open）。ここでは状態と
     読み上げ用の属性（aria-expanded / aria-controls）だけを扱う。 */
  document.querySelectorAll('.acc__q').forEach(function (btn, i) {
    var item = btn.closest('.faq__i');
    var panel = item && item.querySelector('.acc__a');
    if (panel) {
      var id = 'faq-a-' + (i + 1);
      panel.id = id;
      btn.setAttribute('aria-controls', id);
    }
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- フッターの年号 ---------- */
  document.querySelectorAll('[data-year]').forEach(function (e) {
    e.textContent = new Date().getFullYear();
  });

  /* ---------- 流入元と「どのCTAから押したか」を予約URLへ引き継ぐ ----------
     Square（別ドメイン）へ移動したあとも、どの広告・どのボタン経由かを
     追えるようにするため。解析サービスへの送信はここでは行わない。
       lp_cta … header / hero / cta_band / mobile_bar / セクションのid
       lp_ver … w（この女性向けLP。index.html は b） */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var q = new URLSearchParams(location.search), src = {};
  KEYS.forEach(function (k) { if (q.get(k)) src[k] = q.get(k); });
  try {
    if (Object.keys(src).length) sessionStorage.setItem('dl_src_w', JSON.stringify(src));
    else { var saved = sessionStorage.getItem('dl_src_w'); if (saved) src = JSON.parse(saved); }
  } catch (e) { /* プライベートモードでは保存できない。付与だけ行う */ }

  document.querySelectorAll('a[href*="book.squareup.com"]').forEach(function (a) {
    var url;
    try { url = new URL(a.href); } catch (e) { return; }
    Object.keys(src).forEach(function (k) { url.searchParams.set(k, src[k]); });
    var sec = a.closest('section[id]');
    url.searchParams.set('lp_cta',
      a.closest('.mcta') ? 'mobile_bar' :
      a.closest('.hd')   ? 'header' :
      a.closest('.fv')   ? 'hero' :
      a.closest('.cta')  ? 'cta_band' :
      sec ? sec.id : 'body');
    url.searchParams.set('lp_ver', 'w');
    a.href = url.toString();
  });
})();
