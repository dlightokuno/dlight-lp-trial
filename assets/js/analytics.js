/* =========================================================
   D/LIGHT GYM 体験LP — アクセス解析（Google Analytics 4）

   ▼ 設定はこの1行だけ ▼
   Googleアナリティクスで発行された測定ID（G-から始まる文字列）を
   下の '' の中に貼り付けると計測が始まります。
   空のままなら計測は一切行われません（外部への送信もしません）。
   ※本家サイトと同じ測定IDを入れれば、同じレポートで比較できます。
   ========================================================= */
var GA_MEASUREMENT_ID = 'G-LESJ5MJNHV';   // 例: 'G-XXXXXXXXXX'

/* ▼ Google広告のコンバージョン計測 ▼
   Google広告 →「目標」→「コンバージョン」→ 各アクション →「タグを設定する」に出る
   send_to: 'AW-XXXXXXXXX/ラベル' を、スラッシュの前後で分けて入れてある。

   ★Google広告が案内するスニペットを <head> にそのまま貼らないこと。
     このLPは assets/js/analytics.js が gtag.js を1本だけ読み込んでいる。
     案内どおりに貼ると2本目が読まれ、さらに下のクリック処理と二重になって
     コンバージョンが2倍に膨らむ。IDはここに置き、送信もここから行う。

   ラベルを '' にすれば、そのアクションだけ送らなくなる。
   ID が 'AW-' 形式でなければ、広告へは一切送らない（GA4だけ動く）。 */
var ADS_CONVERSION_ID = 'AW-18357784683';
var ADS_LABEL_RESERVE = 'peb6CK742OscEOug1rFE';   // 体験予約ボタン（Squareへのリンク）
var ADS_LABEL_LINE    = 'Y0arCOnuzescEOug1rFE';   // 公式LINEへのリンク

(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var gaOn  = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
  var adsOn = /^AW-[0-9]+$/i.test(ADS_CONVERSION_ID);

  /* 広告へコンバージョンを1件送る。ラベルが空のものは送らない。
     呼ぶ場所は下のクリック処理の中だけにすること（2か所から呼ぶと二重になる）。 */
  function adsConversion(label) {
    if (!adsOn || !label) return;
    gtag('event', 'conversion', { send_to: ADS_CONVERSION_ID + '/' + label });
  }

  /* gtag.js は1本読み込めば、GA4と広告の両方をその1本で送れる。
     広告用にもう1本 <script> を足すと同じイベントが二重に飛ぶので、
     必ずどちらか片方のIDで読むこと。送り先は config で分ける。 */
  if (gaOn || adsOn) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?' +
            'id=' + (gaOn ? GA_MEASUREMENT_ID : ADS_CONVERSION_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
  }
  if (gaOn) gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  /* 広告側の config は必須。これが無いと広告クリックの gclid がCookieに残らず、
     「どの広告クリックがコンバージョンしたか」が結び付かない。
     タグ自体は動いているのにコンバージョン0件、という状態になる。 */
  if (adsOn) gtag('config', ADS_CONVERSION_ID);

  /* ---------- ボタンが「どこで」押されたかを判定 ----------
     A案とB案でラッパーのクラス名が違う（A: .header / .hero / .cta-band / .footer、
     B: .hd / .fv / .cta / .ft）。片方しか書かないと、書いていないほうのLPでは
     ヘッダー・ファーストビュー・最終CTAのクリックが全部 'body' に落ちてしまい、
     「どのCTAが予約につながったか」をGA4で分解できなくなる。必ず両方を見ること。
     どれにも当てはまらないときは、囲っている section の id をそのまま使う。 */
  function positionOf(el) {
    if (el.closest('.mcta'))           return 'mobile_bar';  // スマホ下部の固定バー
    if (el.closest('.header, .hd'))    return 'header';      // ヘッダー
    if (el.closest('.hero, .fv'))      return 'hero';        // メインビジュアル
    if (el.closest('.cta-band, .cta')) return 'cta_band';    // ページ下部のCTA
    if (el.closest('.footer, .ft'))    return 'footer';      // フッター
    var sec = el.closest('section[id]');                     // #results #price #trial など
    return sec ? sec.id : 'body';
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
      /* GA4推奨イベント版。position などを引き継がないと
         「どのCTAがリードを生んだか」を標準レポートで分解できない */
      gtag('event', 'generate_lead', Object.assign({ currency: 'JPY', value: 5000 }, params));

      /* ---------- Google広告へのコンバージョン送信 ----------
         予約もLINEもリンクは全部 target="_blank"。別タブが開いてこのページは
         生きたまま残るので、送信が途中で切れる心配はない。
         同じタブで遷移する作りに変えたら、event_callback で待つ必要が出る。

         金額を送っていない理由：ここで分かるのは「予約ページを開いた」ことだけで、
         体験の5,000円が入ったわけではない。仮の金額を送ると、その嘘の数字で
         入札が最適化されてしまう。金額を入れるなら、Google広告の
         コンバージョンアクション側で「デフォルト値」として設定すること。

         ★このコンバージョンは予約の完了ではなく、予約ページを開いたクリック。
           実際の予約はSquare側（別ドメイン）で起きるので、このLPからは見えない。 */
      adsConversion(ADS_LABEL_RESERVE);
    } else if (href.indexOf('lin.ee') > -1) {
      gtag('event', 'line_click', params);
      adsConversion(ADS_LABEL_LINE);
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
