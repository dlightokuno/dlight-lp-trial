/* =========================================================
   D/LIGHT GYM 体験LP — アクセス解析（Google Analytics 4）

   ▼ 設定はこの1行だけ ▼
   Googleアナリティクスで発行された測定ID（G-から始まる文字列）を
   下の '' の中に貼り付けると計測が始まります。
   空のままなら計測は一切行われません（外部への送信もしません）。
   ※本家サイトと同じ測定IDを入れれば、同じレポートで比較できます。
   ========================================================= */
var GA_MEASUREMENT_ID = '';   // 例: 'G-XXXXXXXXXX'

(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var enabled = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);

  if (enabled) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?' + 'id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  /* ---------- ボタンが「どこで」押されたかを判定 ---------- */
  function positionOf(el) {
    if (el.closest('.mcta'))     return 'mobile_bar';    // スマホ下部の固定バー
    if (el.closest('.header'))   return 'header';        // ヘッダー
    if (el.closest('.hero'))     return 'hero';          // メインビジュアル
    if (el.closest('#trial'))    return 'trial_section'; // 体験トレーニングの案内
    if (el.closest('#price'))    return 'price_block';   // 料金
    if (el.closest('#faq'))      return 'faq';           // FAQ
    if (el.closest('.cta-band')) return 'cta_band';      // ページ下部のCTA
    if (el.closest('.footer'))   return 'footer';        // フッター
    return 'body';
  }

  /* ---------- 予約 / LINE / Instagram / メール / 地図のクリックを記録 ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;

    var href = a.getAttribute('href') || '';
    var params = {
      link_url:  href,
      link_text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      position:  positionOf(a),
      page_path: location.pathname
    };

    if (href.indexOf('book.squareup.com') > -1) {
      params.service = 'trial_training';
      gtag('event', 'reserve_click', params);
      gtag('event', 'generate_lead', { currency: 'JPY', value: 5000 });
    } else if (href.indexOf('lin.ee') > -1) {
      gtag('event', 'line_click', params);
    } else if (href.indexOf('instagram.com') > -1) {
      gtag('event', 'instagram_click', params);
    } else if (href.indexOf('mailto:') === 0) {
      gtag('event', 'mail_click', params);
    } else if (href.indexOf('google.com/maps') > -1) {
      gtag('event', 'map_click', params);
    }
  }, true);

  /* ---------- FAQを開いたら、どの質問かを記録 ---------- */
  document.querySelectorAll('.acc__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') return; // 閉じる操作は記録しない
      gtag('event', 'faq_open', { question: btn.textContent.trim().slice(0, 80) });
    });
  });

  /* ---------- どこまで読まれたか（LP用・25/50/75/100%で1回ずつ） ---------- */
  var marks = [25, 50, 75, 100], done = {};
  window.addEventListener('scroll', function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var pct = (window.scrollY || doc.scrollTop) / max * 100;
    marks.forEach(function (m) {
      if (!done[m] && pct >= m) {
        done[m] = true;
        gtag('event', 'scroll_depth', { percent_scrolled: m, page_path: location.pathname });
      }
    });
  }, { passive: true });
})();
