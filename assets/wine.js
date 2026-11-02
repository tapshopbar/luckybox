/* 와인 카드 QR 페이지 렌더 (tsb.wine/w/<id>). 데이터 = data.js 의 CARDS[WINE_ID] · v2 */
(function () {
  var LB = window.LB, W = (window.CARDS || {})[window.WINE_ID], L = window.LADDER10;
  var WARN = '경고: 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생 위험을 높입니다. 음주운전은 자신과 다른 사람의 생명을 위태롭게 할 수 있습니다.';
  var src = new URLSearchParams(location.search).get('src') || '';
  var log = function (k, v) {
    var row = { k: k, v: v || '', w: window.WINE_ID, src: src, b: new URLSearchParams(location.search).get('b') || '', t: Date.now() };
    console.log('[winecard]', row);
    if (LB.log) { try { new Image().src = LB.log + '?' + new URLSearchParams(row).toString(); } catch (e) {} }
  };
  window.wcLog = log;
  window.lbToast = function (msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on'); clearTimeout(t._tm); t._tm = setTimeout(function () { t.classList.remove('on'); }, 1800);
  };
  window.wcShare = function () {
    var data = { title: document.title, text: (W ? W.nameKo : '') + ' · 탭샵바 와인 카드', url: location.href.split('#')[0] };
    log('share');
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    try { navigator.clipboard.writeText(data.url).then(function () { lbToast('주소를 복사했어요'); }); } catch (e) { prompt('주소', data.url); }
  };
  if (!W) { document.getElementById('app').innerHTML = '<p style="padding:40px 22px">와인 정보를 찾지 못했어요. <a class="btn o sm" href="' + LB.site + '">tsb.wine</a></p>'; return; }

  var h = '';
  h += '<header class="top"><div class="left"><a class="btn o sm" href="/luckybox/" onclick="wcLog(\'nav\',\'luckybox\')"><span class="arr">←</span> 럭키박스</a></div>' +
    '<a class="logo" href="' + LB.site + '" aria-label="탭샵바 홈페이지"><img src="/luckybox/assets/wordmark.png" alt="TAP SHOP BAR"></a>' +
    '<a class="btn o sm" href="' + LB.site + '">홈페이지</a></header>';

  h += '<section class="whero"><div class="meta"><span class="chip">' + (W.type === 'white' ? '화이트' : W.type === 'red' ? '레드' : '스파클링') + '</span><span class="chip">' + W.country + '</span>' +
    (W.ladder ? '<span class="chip">12 사다리 ' + W.ladder + '번</span>' : '') + '</div>' +
    '<h1>' + W.nameKo + '</h1><div class="en">' + W.nameEn + '</div>' +
    '<div class="words">' + W.words.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
    '<div class="spec"><div><span>산지</span><b>' + W.region + '</b></div><div><span>품종</span><b>' + W.grape + '</b></div>' +
    '<div><span>마시기 좋은 온도</span><b class="tnum">' + W.temp + '</b></div><div><span>용량</span><b class="tnum">' + W.size + '</b></div></div></section>';

  /* 맛 */
  var lab = { 당도: ['드라이', '달콤'], 산도: ['부드러운', '상큼한'], 바디: ['가벼운', '묵직한'] };
  h += '<section class="sec"><h2>어떤 맛이에요?</h2><div class="bars">' + Object.keys(W.bars).map(function (k) {
    var v = W.bars[k], c = '';
    for (var i = 1; i <= 5; i++) c += '<i class="' + (i <= v ? 'on' : '') + '"></i>';
    return '<div class="b"><span>' + k + '</span><div class="t">' + c + '</div><div class="lab"><span>' + lab[k][0] + '</span><span>' + lab[k][1] + '</span></div></div>';
  }).join('') + '</div>';
  if (W.ladder && L) {
    h += '<div class="lad"><div class="big">' + W.ladder + '</div><div style="flex:1;min-width:0"><h3>12 사다리 ' + W.ladder + '번 · ' + L.ko + '</h3><ul>' +
      W.ladderWhy.map(function (x) { var p = x.split('→'); return '<li><span>' + p[0].trim() + '</span>' + (p[1] ? p[1].trim() : '') + '</li>'; }).join('') + '</ul>' +
      '<p class="s muted" style="margin-top:10px">이름 몰라도 번호만 기억하면 비슷한 와인을 다시 찾을 수 있어요.</p></div></div>';
  }
  h += '</section>';

  /* 이야기 */
  h += '<section class="sec story"><h2>30초 이야기</h2>' + W.story.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</section>';

  /* 페어링 */
  h += '<section class="sec"><h2>이렇게 곁들여요</h2><div class="pair">' + W.pairing.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
    (W.tempNote ? '<p class="temp">' + W.tempNote + '</p>' : '') + '</section>';

  /* 가격 비교: 탭샵바 판매가 확정 + 국내 와인숍 가격 확인 후에만 보임 (외국 가격은 쓰지 않음) */
  if (W.price && W.shop) {
    h += '<section class="sec"><h2>와인숍보다 싸요</h2><p class="lead tnum">국내 와인숍 ' + W.shop.krw.toLocaleString('ko-KR') + '원, 탭샵바 ' + W.price.toLocaleString('ko-KR') + '원</p><p class="s muted">' + W.shop.note + '</p></section>';
  }

  /* 다시 사기 · 탭 */
  h += '<section class="sec"><h2>마음에 들었다면</h2><div class="acts">' +
    '<div class="act"><div class="ic">1</div><div class="tx"><b>다시 사기</b><span class="d">매장에 재고를 물어보고 예약해요. 받는 건 매장에서.</span></div><a class="btn w sm" href="' + LB.reservation + '" onclick="wcLog(\'rebuy\',\'reservation\')">예약하기</a></div>' +
    '<div class="act"><div class="ic">2</div><div class="tx"><b>탭으로 한 잔</b><span class="d">' + (W.tap ? W.tap.join('·') + ' 탭에서 잔으로 마실 수 있어요.' : '이 와인을 잔으로 내는 매장을 정리하고 있어요.') + '</span></div>' + (W.tap ? '<a class="btn o sm" href="' + LB.site + '">매장 보기</a>' : '<span class="tag">준비 중</span>') + '</div>' +
    '</div><p class="note">술은 매장에서 직접 건네 드려야 해서 온라인 결제·택배는 안 돼요. 19세 미만 판매 불가.</p></section>';

  /* 별점 */
  h += '<section class="sec"><h2>이 와인, 어땠어요?</h2><p class="lead">한 번만 눌러 주세요. 다음에 어떤 와인을 들여올지 정할 때 써요.</p>' +
    '<div class="rate" id="rate" role="group" aria-label="평가"><button type="button" data-v="1">별로예요</button><button type="button" data-v="2">괜찮아요</button><button type="button" data-v="3">또 살래요</button></div><div class="thanks" id="thanks"></div></section>';

  h += '<footer class="foot"><div class="slogan">wine is second americano</div><span class="site">주식회사 탭샵바 · tsb.wine</span>' +
    '<div class="links"><a class="btn d sm" href="/luckybox/">와인 럭키박스</a><a class="btn d sm" href="' + LB.site + '">탭샵바 홈페이지</a><a class="btn d sm" href="https://tapshopbar.github.io/newwines/">새 와인 보기</a><button class="btn d sm" type="button" onclick="wcShare()">공유하기</button></div>' +
    '<p class="warn">' + WARN + '</p></footer><div class="toast" id="toast" role="status"></div>';

  document.getElementById('app').innerHTML = h;

  var key = 'tsb-rate-' + window.WINE_ID, prev = null;
  try { prev = localStorage.getItem(key); } catch (e) {}
  var btns = document.querySelectorAll('#rate button');
  var mark = function (v) { btns.forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); }); document.getElementById('thanks').textContent = '고마워요. 다음 발주에 반영할게요.'; };
  if (prev) mark(prev);
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.v; mark(v); log('rate', v);
      try { localStorage.setItem(key, v); } catch (e) {}
    });
  });
  log('view', 'card');
})();
