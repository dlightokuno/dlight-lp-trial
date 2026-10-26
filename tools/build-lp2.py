# -*- coding: utf-8 -*-
"""index.html から lp2.html を作る。index.html は一切変更しない。"""
import io, re, sys

src = io.open('index.html', encoding='utf-8').read()
s = src

def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:60], s.count(old), count)
    s = s.replace(old, new)

# ---------- 1. head ----------
rep('<title>初回体験80分 3,300円｜八丁堀・新富町のパーソナルジム D/LIGHT GYM</title>',
    '<title>初回体験80分 3,300円｜八丁堀・新富町のパーソナルジム D/LIGHT GYM</title>\n'
    '<!-- ============================================================\n'
    '     lp2.html ＝ index.html の改善版（2026/10/27）。\n'
    '     「広告のクリックはあるのに予約が入らない」を直すために作った。\n'
    '     index.html は触っていないので、2本を同時に出して比べられる。\n'
    '     何を・なぜ変えたかは lp2-notes.md に全部書いてある。\n'
    '     ★CSSは lp-b.css をそのまま使い、追加分だけ下の <style> にある。\n'
    '     ============================================================ -->')

# canonical は外す（同じ内容が2本あるため、どちらかを正にすると誤解のもと）
rep('<link rel="canonical" href="https://dlightgym.com/lp/trial/">',
    '<!-- lp2 は検証用。canonical は置かない（noindex のまま運用する） -->')

rep('<meta property="og:url" content="https://dlightgym.com/lp/trial/">',
    '<meta property="og:url" content="https://dlightokuno.github.io/dlight-lp-trial/lp2.html">')

# ---------- 2. 追加CSS ----------
ADD_CSS = '''
<!-- lp2 で足したぶんだけ。lp-b.css は1行も変えていないので、
     このブロックを消せば index.html と同じ見た目に戻る。 -->
<style>
/* 予約の進め方。Squareの画面が「追加」から始まるので、
   その1手目を先に見せておかないと、ここで止まる人が出る。 */
.bk{margin-top:clamp(16px,2.4vw,24px);border:1px solid var(--line);
  border-radius:var(--radius);background:var(--paper);padding:14px 16px;text-align:left}
.bk--on-navy{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.22)}
.bk__hd{font-size:12.5px;font-weight:700;letter-spacing:.08em;color:var(--gold-d)}
.bk--on-navy .bk__hd{color:var(--sand)}
.bk__list{margin-top:9px;display:grid;gap:7px}
.bk__list li{display:grid;grid-template-columns:auto 1fr;gap:9px;align-items:start;
  font-size:12.5px;line-height:1.7;color:var(--ink-2)}
.bk--on-navy .bk__list li{color:rgba(255,255,255,.88)}
.bk__list li b{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;
  background:var(--navy);color:#fff;font-family:var(--f-en);font-size:11px;
  font-weight:600;line-height:1;margin-top:2px}
.bk--on-navy .bk__list li b{background:var(--gold);color:var(--navy-d)}
.bk__alt{margin-top:10px;padding-top:9px;border-top:1px solid var(--line);
  font-size:12px;line-height:1.7;color:var(--ink-3)}
.bk--on-navy .bk__alt{border-top-color:rgba(255,255,255,.18);color:rgba(255,255,255,.72)}
.bk__alt a{color:var(--gold-d);font-weight:700}
.bk--on-navy .bk__alt a{color:var(--sand)}

/* ファーストビューに置く1行版。ここで長い説明を足すと料金が下へ落ちるので、
   1行だけにしてある（詳しい手順は #trial と最終CTAにある）。 */
.bk__mini{margin-top:10px;font-size:11.5px;line-height:1.65;color:var(--ink-3);text-wrap:pretty}

/* いつ通うか */
.when{margin-top:clamp(18px,2.6vw,26px);display:grid;gap:10px}
@media(min-width:800px){.when{grid-template-columns:repeat(3,1fr)}}
.when li{border:1px solid var(--line);border-radius:var(--radius);
  background:var(--paper);padding:14px 16px}
.when__t{display:inline-block;font-size:14px;font-weight:700;color:var(--navy);
  border-bottom:2px solid var(--gold);padding-bottom:3px}
.when__d{margin-top:9px;font-size:13px;line-height:1.8;color:var(--ink-2)}
</style>
'''
rep('<noscript><style>', ADD_CSS + '<noscript><style>')

# ---------- 3. ボタンの文言（着地と合わせる） ----------
# index のボタンは「空き状況を見る」だが、Squareの着地はメニュー説明ページで
# カレンダーはその先。期待とずれるので、着地に合わせた言い方に変える。
rep('体験の空き状況を見る<span class="btn__sub">希望日時を選んで予約できます</span>',
    '体験を予約する<span class="btn__sub">次の画面で日時を選べます・約2分</span>', 4)
rep('>体験の空き状況を見る<small>初回80分 3,300円（税込）</small></a>',
    '>体験を予約する<small>初回80分 3,300円（税込）</small></a>', 1)
rep('>空き状況を見る</a>', '>体験を予約する</a>', 1)

# ---------- 4. FVに1行だけ手順を添える ----------
rep('''      <a class="btn btn--line" href="https://lin.ee/v4NK1TV" target="_blank" rel="noopener">予約前にLINEで相談する</a>
    </div>
  </div>

  <div class="fv__sup">''',
    '''      <a class="btn btn--line" href="https://lin.ee/v4NK1TV" target="_blank" rel="noopener">予約前にLINEで相談する</a>
    </div>
    <p class="bk__mini">予約ページは、次の画面で<strong>「追加」</strong>→ カレンダーで日時を選ぶ流れです。約2分で終わります。</p>
  </div>

  <div class="fv__sup">''')

# ---------- 5. 新セクション：いつ通うか（#commute） ----------
COMMUTE = '''
<!-- ============ いつ通うか（lp2で追加） ============
     「やったほうがいいのは分かるが、いつ行くのか」が決まらないと予約されない。
     八丁堀・新富町はオフィス街で、来る人の大半は通勤導線の途中にいる。
     ★空き枠の出やすさは実際のSquareの設定に合わせて書くこと。
       ここで「朝が取れます」と書くと、取れなかったときに失望させる。 -->
<section class="sec sec--white" id="commute">
  <div class="wrap wrap--narrow">
    <h2 class="ttl" data-reveal><span class="ttl__en">When</span>通勤の途中に、<br class="sp-br">週1回を置いていく。</h2>
    <p class="lead" data-reveal>続かない理由の多くは、やる気ではなく<strong>移動</strong>です。わざわざ出向く場所ではなく、いつもの道の途中にあること。それが週1回を続けられるかどうかを、いちばん左右します。</p>
    <ul class="when" data-reveal>
      <li>
        <p class="when__t">出社前</p>
        <p class="when__d">8:00から営業しています。朝のうちに終わらせて、そのまま職場へ向かえます。</p>
      </li>
      <li>
        <p class="when__t">日中</p>
        <p class="when__d">外出の合間や在宅勤務の日に。<strong>比較的お取りいただきやすい時間帯</strong>です。</p>
      </li>
      <li>
        <p class="when__t">仕事帰り</p>
        <p class="when__d">最終のご予約は20:30から。残業があった日でも間に合います。</p>
      </li>
    </ul>
    <p class="note" data-reveal>八丁堀駅はJR京葉線・東京メトロ日比谷線、新富町駅は東京メトロ有楽町線。どちらの駅からも徒歩5分、築地・銀座・茅場町からも歩ける距離です。<br>※ ご希望の時間が埋まっていることもあります。その場合はLINEからご相談ください。</p>
  </div>
</section>

'''

# ---------- 6. 新セクション：いま始める理由（#season） ----------
SEASON = '''
<!-- ============ いま始める理由（lp2で追加） ============
     10月末〜12月向けの文面。★季節が変わったら必ず書き替えること。
     1〜3月は「1月に決めた人が続かない時期」、4〜6月は健康診断、
     7〜9月は夏と夏バテ、と軸が変わる。古い季節の文面が残っていると、
     読んだ瞬間に「放置されたページ」に見える。 -->
<section class="sec sec--paper" id="season">
  <div class="wrap wrap--narrow">
    <h2 class="ttl" data-reveal><span class="ttl__en">Now</span>1月からだと、<br class="sp-br">少し遅いかもしれません。</h2>
    <div class="prose" data-reveal>
      <p>ここから年末にかけて、会食とお酒の予定が増えていきます。そのうえ寒くなり、歩く量も自然と減ります。<strong>1年のうちで、身体がいちばん崩れやすいのがこの2カ月です。</strong></p>
      <p>崩れてから戻すより、崩れる前に整えておくほうが、かかる時間は短くて済みます。</p>
      <p>そして年末年始を<strong>「すでに通っている状態」で迎えられるかどうか</strong>で、その後の続きやすさは変わります。1月に新しく始めるのは、1年でいちばん気持ちの切り替えが要る時期だからです。</p>
    </div>
  </div>
</section>

'''

rep('<!-- ============ 初回体験80分 ============ -->', COMMUTE + SEASON + '<!-- ============ 初回体験80分 ============ -->')

# ---------- 7. #trial に予約手順のフル版 ----------
BK_FULL = '''
    <!-- Squareの画面を実際に通して確かめた手順（2026/10/27）。
         ★Squareのメニュー構成を変えたら、ここも必ず直すこと。
           特に【会員様】メニューが「無料」と表示される件は、
           初回の方が「無料のほうを選べばいいのか」と迷う原因になっている。 -->
    <div class="bk" data-reveal>
      <p class="bk__hd">ご予約の進め方（約2分）</p>
      <ol class="bk__list">
        <li><b>1</b>「体験を予約する」を押すと、メニューの説明が開きます。いちばん下の<strong>「追加」</strong>を押してください</li>
        <li><b>2</b>「さらに予約を追加しますか？」と出たら、そのまま<strong>「次へ」</strong>へ進みます</li>
        <li><b>3</b>カレンダーから日時を選び、お名前と連絡先を入力すれば完了です</li>
      </ol>
      <p class="bk__alt"><strong>【会員様】と書かれたメニューは、すでに通われている方のものです。</strong>初回の方は「★初回限定★ 身体チェック付き｜80分体験 3,300円」をお選びください。</p>
    </div>
'''
rep('''      <div class="scope__box scope__box--care">
        <p class="scope__hd">先に医療機関へ</p>
        <p>強い痛みや急な症状がある場合は、まず医療機関へご相談ください。当ジムは治療を行う施設ではありません。</p>
      </div>
    </div>
  </div>
</section>''',
'''      <div class="scope__box scope__box--care">
        <p class="scope__hd">先に医療機関へ</p>
        <p>強い痛みや急な症状がある場合は、まず医療機関へご相談ください。当ジムは治療を行う施設ではありません。</p>
      </div>
    </div>
''' + BK_FULL + '''  </div>
</section>''')

# ---------- 8. 最終CTAにも手順と受け皿 ----------
rep('''    <p class="cta__safe" data-reveal>完全個室／手ぶらOK／無理な勧誘なし／24時間前まで変更無料</p>''',
'''    <div class="bk bk--on-navy" data-reveal>
      <p class="bk__hd">ご予約の進め方（約2分）</p>
      <ol class="bk__list">
        <li><b>1</b>次の画面で、いちばん下の<strong>「追加」</strong>を押す</li>
        <li><b>2</b>「さらに予約を追加しますか？」は、そのまま<strong>「次へ」</strong></li>
        <li><b>3</b>カレンダーで日時を選び、お名前と連絡先を入力して完了</li>
      </ol>
      <p class="bk__alt">ご希望の日時が空いていないときは、<a href="https://lin.ee/v4NK1TV" target="_blank" rel="noopener">LINEからご相談ください</a>。</p>
    </div>
    <p class="cta__safe" data-reveal>完全個室／手ぶらOK／無理な勧誘なし／24時間前まで変更無料</p>''')

io.open('lp2.html', 'w', encoding='utf-8').write(s)
print('lp2.html 生成（完成）', len(s), 'bytes')

