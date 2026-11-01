/* WINE LUCKY BOX 메인 페이지 렌더 (데이터 = data.js) · v2 */
(function () {
  var LB = window.LB, T = window.TIERS, BR = window.BRANCHES, ST = window.STOCK || {};
  var won = function (n) { return n.toLocaleString('ko-KR'); };
  var pct = function (n) { return Math.round(n / LB.total * 100); };
  var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };
  var WARN = '경고: 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생 위험을 높입니다. 음주운전은 자신과 다른 사람의 생명을 위태롭게 할 수 있습니다.';
  /* 남은 수량 표는 STOCK 에 실제 숫자가 하나라도 들어와야 보입니다 (없으면 섹션 자체를 안 그림) */
  var HAS_STOCK = Object.keys(ST).some(function (k) { return ST[k] && Object.keys(ST[k]).length; });

  window.lbLog = function (k, v) {
    var row = { k: k, v: v || '', p: location.pathname, src: new URLSearchParams(location.search).get('src') || '', t: Date.now() };
    console.log('[luckybox]', row);
    if (LB.log) { try { new Image().src = LB.log + '?' + new URLSearchParams(row).toString(); } catch (e) {} }
  };
  window.lbToast = function (msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on'); clearTimeout(t._tm); t._tm = setTimeout(function () { t.classList.remove('on'); }, 1800);
  };
  window.lbShare = function () {
    var data = { title: document.title, text: '검은 상자 안에 와인 한 병, 39,000원. 12월 1일부터.', url: location.href.split('#')[0] };
    lbLog('share');
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    try { navigator.clipboard.writeText(data.url).then(function () { lbToast('주소를 복사했어요'); }); } catch (e) { prompt('주소', data.url); }
  };

  var stars = '<svg class="stars" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="#FFFDFC" stroke-width=".8">' +
    [[14, 34, 5], [350, 40, 5], [340, 150, 8], [372, 300, 6], [30, 500, 6], [210, 24, 4], [250, 490, 5]].map(function (s) {
      var x = s[0], y = s[1], r = s[2];
      return '<path d="M' + x + ' ' + (y - r) + 'V' + (y + r) + 'M' + (x - r) + ' ' + y + 'H' + (x + r) + 'M' + (x - r * .6) + ' ' + (y - r * .6) + 'L' + (x + r * .6) + ' ' + (y + r * .6) + 'M' + (x + r * .6) + ' ' + (y - r * .6) + 'L' + (x - r * .6) + ' ' + (y + r * .6) + '"/>';
    }).join('') + '</svg>';

  /* 디자인 시안(box.jpg / box.png)이 없을 때 보이는 기본 박스 그림 */
  var boxSvg = '<svg viewBox="0 0 220 360" role="img" aria-label="탭샵바 와인 럭키박스">' +
    '<defs><linearGradient id="bx" x1="0" x2="1"><stop offset="0" stop-color="#1b1b1f"/><stop offset=".55" stop-color="#0E0E0E"/><stop offset="1" stop-color="#050505"/></linearGradient>' +
    '<linearGradient id="sl" x1="0" x2="1"><stop offset="0" stop-color="#6E1426"/><stop offset="1" stop-color="#3A0812"/></linearGradient></defs>' +
    '<path d="M40 40 L160 40 L190 20 L70 20 Z" fill="#26262b"/>' +
    '<path d="M160 40 L190 20 L190 330 L160 350 Z" fill="#000"/>' +
    '<rect x="40" y="40" width="120" height="310" fill="url(#bx)"/>' +
    '<path d="M40 150 H160 V250 H40 Z" fill="url(#sl)"/><path d="M160 150 L190 130 V230 L160 250 Z" fill="#2a0610"/>' +
    '<text x="100" y="205" text-anchor="middle" fill="#FFFDFC" font-family="Pretendard Variable,Pretendard,sans-serif" font-weight="800" font-size="15" letter-spacing="1">WINE</text>' +
    '<text x="100" y="223" text-anchor="middle" fill="#FFFDFC" font-family="Pretendard Variable,Pretendard,sans-serif" font-weight="800" font-size="15" letter-spacing="1">LUCKY BOX</text>' +
    '</svg>';

  var h = '';
  h += '<header class="top"><a class="logo" href="' + LB.site + '" aria-label="탭샵바 홈페이지"><img src="assets/wordmark.png" alt="TAP SHOP BAR"></a>' +
    '<a class="btn o sm" href="' + LB.site + '" onclick="lbLog(\'nav\',\'home\')">홈페이지</a></header>';

  /* 첫 화면 */
  h += '<section class="hero">' + stars + '<div class="hero-in">' +
    '<div class="hero-txt"><span class="ed">HOLIDAY EDITION 2026</span>' +
    '<h1>WINE<br>LUCKY BOX</h1>' +
    '<p class="sub">검은 상자 안에 와인 한 병. 무엇이 들었는지는 열어 봐야 알아요. 어떤 병이 나와도 이름 들으면 아는 와인이에요.</p></div>' +
    '<div class="boxwrap" id="boxwrap">' + boxSvg + '</div>' +
    '<div class="hero-foot">' +
    '<div class="facts"><div><b>' + won(LB.price) + '원</b><span>한 상자</span></div><div><b>' + LB.start + '</b><span>부터</span></div><div><b>' + BR.length + '개 매장</b><span>' + LB.total + '상자 한정</span></div></div>' +
    '<div class="cta"><a class="btn p lg" href="#inside" onclick="lbLog(\'cta\',\'inside\')">구성 보기</a><a class="btn g lg" href="#how" onclick="lbLog(\'cta\',\'how\')">어떻게 사요?</a></div>' +
    '</div></div></section>';

  /* 구성 공개 */
  h += '<section class="sec" id="inside"><span class="k">What\'s inside</span><h2>' + LB.total + '상자, 구성은 전부 공개해요</h2>' +
    '<p class="lead">어느 상자에 무엇이 들었는지만 몰라요. 몇 병이 들어 있는지는 미리 알려 드려요.</p><div class="tiers">';
  T.forEach(function (t) {
    var c = sum(t.per), w = Math.max(3, c / LB.total * 100);
    if (t.mystery) {
      h += '<div class="tier mys"><div class="q">?</div><div class="row"><h3>' + t.name + '</h3><div class="n">' + c + '병<em>' + pct(c) + '%</em></div></div>' +
        '<div class="sub">' + t.sub + '</div><div class="bar"><i style="width:' + w + '%"></i></div></div>';
      return;
    }
    h += '<div class="tier"><div class="row"><h3>' + t.name + '</h3><div class="n">' + c + '병<em>' + pct(c) + '%</em></div></div>' +
      '<div class="sub">' + t.sub + '</div><div class="bar"><i style="width:' + w + '%"></i></div>';
    if (!t.hideNames && t.wines.length > 1) {
      h += '<ul>' + t.wines.map(function (x) {
        var right = '<span class="q">' + x.q + '병</span>';
        if (x.card) right = '<span class="r"><span class="q">' + x.q + '병</span><a class="btn o sm" href="w/' + x.card + '/" onclick="lbLog(\'card\',\'' + x.card + '\')">카드 보기</a></span>';
        return '<li><span>' + x.n + '</span>' + right + '</li>';
      }).join('') + '</ul>';
    }
    if (t.link) h += '<div class="tf"><a class="btn o sm" href="' + t.link + '" target="_blank" rel="noopener" onclick="lbLog(\'story\',\'' + t.code + '\')">와인 이야기 보기 <span class="arr">↗</span></a></div>';
    h += '</div>';
  });
  h += '</div>';

  /* 매장별 배분 (처음 수량, 공개 정보) */
  var cols = T.filter(function (t) { return t.code !== 'E'; });
  var tot = { all: 0 }; cols.forEach(function (t) { tot[t.code] = 0; });
  h += '<p class="subh">매장별로 이렇게 나눠요</p><p class="note">비율은 ' + LB.total + '상자 기준이에요. 하우스 픽은 나머지 전부예요.</p>' +
    '<table class="alloc"><thead><tr><th>매장</th>' + cols.map(function (t) { return '<th>' + (t.code === 'C' ? '포메이' : t.code === 'D' ? '셀렉션' : t.name) + '</th>'; }).join('') + '<th>상자</th></tr></thead><tbody>';
  BR.forEach(function (b, i) {
    tot.all += b.boxes;
    h += '<tr><td>' + b.name + '</td>' + cols.map(function (t) { tot[t.code] += t.per[i]; return '<td>' + t.per[i] + '</td>'; }).join('') + '<td><b>' + b.boxes + '</b></td></tr>';
  });
  h += '</tbody><tfoot><tr><td>합계</td>' + cols.map(function (t) { return '<td>' + tot[t.code] + '</td>'; }).join('') + '<td>' + tot.all + '</td></tr></tfoot></table></section>';

  /* 매장별 남은 수량: STOCK 에 숫자가 들어온 뒤에만 */
  if (HAS_STOCK) {
    var left = { all: 0 }; cols.forEach(function (t) { left[t.code] = 0; });
    h += '<section class="sec" id="stock"><span class="k">Stock</span><h2>매장별 남은 수량</h2>' +
      '<p class="lead">매일 아침 숫자를 고쳐요. 줄이 그어진 칸은 그 매장에서 다 나간 거예요.</p>' +
      '<table class="stock"><thead><tr><th>매장</th>' + cols.map(function (t) { return '<th>' + (t.code === 'C' ? '포메이' : t.code === 'D' ? '셀렉션' : t.name) + '</th>'; }).join('') + '<th>남은 상자</th></tr></thead><tbody>';
    BR.forEach(function (b, i) {
      var s = ST[b.id];
      var lf = function (t) { return s && s[t.code] != null ? s[t.code] : t.per[i]; };
      var all = T.reduce(function (x, t) { return x + lf(t); }, 0);
      left.all += all;
      h += '<tr><td>' + b.name + '</td>' + cols.map(function (t) {
        var v = lf(t); left[t.code] += v;
        return '<td class="' + (v === 0 ? 'zero' : '') + '">' + (v === 0 ? t.per[i] : v) + '</td>';
      }).join('') + '<td class="left' + (all === 0 ? ' zero' : '') + '"><b>' + all + '</b> / ' + b.boxes + '</td></tr>';
    });
    h += '</tbody><tfoot><tr><td>합계</td>' + cols.map(function (t) { return '<td>' + left[t.code] + '</td>'; }).join('') + '<td>' + left.all + ' / ' + LB.total + '</td></tr></tfoot></table>' +
      '<div class="upd"><span>' + LB.updated + ' 기준</span><span>매일 업데이트</span></div></section>';
  }

  /* 어떻게 사요 */
  h += '<section class="sec" id="how"><h2>어떻게 사요?</h2><div class="how">' +
    '<div class="way"><div class="h"><div class="nm">1</div><h3>매장에서 바로</h3></div><p>카운터에서 "럭키박스요" 한마디면 돼요. 남은 상자 중에서 직접 골라요.</p></div>' +
    '<div class="way"><div class="h"><div class="nm">2</div><h3>앱으로 미리 결제하고 매장에서 받기</h3><span class="tag">' + (LB.appReady ? '열림' : '준비 중') + '</span></div><p>탭샵바 앱에서 매장을 골라 결제하고, 그 매장에 와서 받아 가요. 받기 전에는 앱에서 취소할 수 있어요.</p></div>' +
    '</div><div class="rule"><b>19세 미만은 살 수 없어요.</b> 받을 때 신분증을 확인해요. 술은 법에 따라 매장 안에서 직접 건네 드려야 해서 <b>택배·배달은 안 돼요.</b></div>' +
    '<div class="btnrow" style="margin-top:18px"><a class="btn w" href="' + LB.reservation + '" onclick="lbLog(\'reserve\')">매장 예약하기</a><a class="btn o" href="' + LB.site + '" onclick="lbLog(\'nav\',\'site\')">매장 위치 보기</a></div></section>';

  /* 상자 안에는 */
  h += '<section class="sec"><h2>상자 안에는</h2><div class="inside">' +
    '<div class="in"><b>와인 한 병</b><p>750ml, 위 구성 중 하나</p></div>' +
    '<div class="in"><b>와인 카드</b><p>커피 원두 카드처럼, 이 병의 이야기</p></div>' +
    '<div class="in full"><b>카드의 QR을 찍으면</b><p>어디서 온 와인인지, 어떤 맛인지, 무엇과 먹으면 좋은지 알려 드려요. 마음에 들면 다시 사는 길도 있어요.</p>' +
    '<div class="qrline"><span>와인 이야기</span><span>다시 사기</span><span>탭으로 한 잔</span></div>' +
    '<div class="btnrow" style="margin-top:16px"><a class="btn w" href="w/cloudy-bay-sb/" onclick="lbLog(\'sample\',\'cloudy-bay-sb\')">카드 예시 보기 <span class="arr">·</span> 클라우디 베이</a></div></div>' +
    '</div></section>';

  /* 자주 묻는 것 */
  var faq = [
    ['상자를 고른 뒤에 바꿀 수 있나요?', '고른 상자는 바꾸거나 환불할 수 없어요. 상자 무게를 재거나 흔들어 보는 것도 안 돼요. 모두에게 같은 조건이에요.'],
    ['앱으로 결제했는데 못 가게 됐어요.', '받기 전이면 앱에서 취소할 수 있어요. 받은 뒤에는 바꿀 수 없어요.'],
    ['대표 와인은 뭐예요?', '12월 1일에 이 페이지에서 공개해요. 매장마다 한 병씩 들어 있어요.'],
    HAS_STOCK ? ['남은 수량은 언제 바뀌나요?', '매일 아침 고쳐요. 낮에 다 나갈 수도 있으니 가기 전에 매장에 전화로 물어보셔도 좋아요.']
              : ['남은 상자가 있는지 어떻게 알아요?', '매장에 전화로 물어보시면 바로 알려 드려요. 남은 상자가 적어지면 이 페이지에도 표시할게요.'],
    ['선물 포장 되나요?', '상자 자체가 선물 상자예요. 쇼핑백이 필요하면 카운터에 말씀해 주세요.'],
    ['몇 상자까지 살 수 있나요?', '따로 정하지 않았어요. 남은 수량이 적은 날에는 매장에서 한 분당 수량을 정할 수 있어요.']
  ];
  h += '<section class="sec"><h2>자주 묻는 것</h2><div class="faq">' + faq.map(function (q) { return '<details><summary>' + q[0] + '</summary><p>' + q[1] + '</p></details>'; }).join('') + '</div></section>';

  /* 아래 */
  h += '<footer class="foot"><div class="slogan">wine is second americano</div><span class="site">주식회사 탭샵바 · tsb.wine</span>' +
    '<div class="links"><a class="btn d sm" href="' + LB.site + '">탭샵바 홈페이지</a><a class="btn d sm" href="' + LB.reservation + '">매장 예약</a><a class="btn d sm" href="https://tapshopbar.github.io/newwines/">새 와인 보기</a><button class="btn d sm" type="button" onclick="lbShare()">공유하기</button></div>' +
    '<p class="warn">' + WARN + '</p></footer><div class="toast" id="toast" role="status"></div>';

  document.getElementById('app').innerHTML = h;

  /* 디자인 시안 이미지가 있으면 교체 */
  ['assets/box.jpg', 'assets/box.png'].reduce(function (p, src) {
    return p.catch(function () {
      return new Promise(function (ok, no) { var im = new Image(); im.onload = function () { ok(src); }; im.onerror = no; im.src = src; });
    });
  }, Promise.reject()).then(function (src) {
    document.getElementById('boxwrap').innerHTML = '<img src="' + src + '" alt="탭샵바 와인 럭키박스 홀리데이 에디션" width="1000" height="1250">';
  }).catch(function () {});

  lbLog('view', 'luckybox');
})();
