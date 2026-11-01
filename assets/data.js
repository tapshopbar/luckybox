/* 탭샵바 WINE LUCKY BOX · Holiday Edition 2026 데이터
   - 남은 수량: STOCK 의 숫자만 고치면 됩니다 (null = 아직 집계 전 → 처음 수량으로 표시).
   - 와인 카드 페이지 추가: CARDS 에 한 덩어리 추가 + w/cloudy-bay-sb 폴더를 복사해 WINE_ID 만 바꾸기.
   - 구성(TIERS)은 composition.json(2026-11-01, 180박스) 기준. 대표 와인(A)은 12/1 공개 전까지 이름을 넣지 않습니다. */

window.LB = {
  price: 39000,
  total: 180,
  start: '12월 1일',
  updated: '2026.12.01',            // 남은 수량을 고친 날 (매일 바꾸기)
  appReady: false,                   // 앱 미리 결제 열리면 true
  site: 'https://tsb.wine/',
  reservation: 'https://tapshopbar.github.io/reservation/', // tsb.wine/reservation 연결되면 교체
  log: '' // 클릭·별점 기록용 웹앱 주소 (newwines 예약유입 시트와 같은 것 쓰면 됨). 비어 있으면 콘솔에만 남김
};

window.BRANCHES = [
  { id: 'cg', name: '청계', full: '청계 (삼일빌딩점)', boxes: 70 },
  { id: 'sa', name: '상암', full: '상암 MBC', boxes: 35 },
  { id: 'dd', name: '동대문', full: '동대문 두타', boxes: 30 },
  { id: 'mg', name: '마곡', full: '마곡', boxes: 25 },
  { id: 'sy', name: '서여의도', full: '서여의도', boxes: 20 }
];

/* per = 지점별 처음 수량 (청계·상암·동대문·마곡·서여의도 순) */
window.TIERS = [
  { code: 'A', name: '대표 와인', sub: '12월 1일에 이름을 공개해요', mystery: true,
    per: [1, 1, 1, 1, 1], wines: [] },
  { code: 'B', name: '샴페인', sub: '프랑스 샹파뉴에서 온 한 병', hideNames: true,
    per: [3, 2, 2, 1, 2], wines: [{ n: '모엣 샹동 브뤼 임페리얼', q: 10 }] },
  { code: 'C', name: '샤또 포메이 2020', sub: '보르도 크뤼 부르주아 · 탭샵바 새 와인', link: 'https://tapshopbar.github.io/newwines/pomeys/',
    per: [3, 2, 2, 1, 2], wines: [{ n: '샤또 포메이 크뤼 부르주아 2020', q: 10 }] },
  { code: 'D', name: '와인박스 셀렉션', sub: '스페인·미국에서 고른 세 가지',
    per: [7, 4, 3, 2, 2], wines: [{ n: '쿠케리 나파 카베르네 소비뇽', q: 2 }, { n: '레살테 오리겐', q: 8 }, { n: '비주엘라 리제르바 템프라니요', q: 8 }] },
  { code: 'E', name: '하우스 픽', sub: '이름 들으면 아는 와인',
    per: [56, 26, 22, 20, 13], wines: [
      { n: '투핸즈 엔젤스 쉐어 쉬라즈', q: 34 },
      { n: '로버트 몬다비 버번 배럴 카베르네', q: 28 },
      { n: '이 기갈 꼬뜨 뒤 론 루즈', q: 28 },
      { n: '클라우디 베이 소비뇽 블랑', q: 20, card: 'cloudy-bay-sb' },
      { n: '루이 자도 부르고뉴 피노 누아', q: 15 },
      { n: '투핸즈 섹시비스트 카베르네', q: 12 }
    ] }
];

/* 남은 수량 (지점 id → 등급별 남은 병). null 이면 처음 수량 그대로 보여 줌 */
window.STOCK = {
  cg: null, // 예: { A: 1, B: 2, C: 3, D: 6, E: 40 }
  sa: null,
  dd: null,
  mg: null,
  sy: null
};

/* 박스 안 와인 카드 → QR 로 열리는 페이지 (tsb.wine/w/<id>) */
/* 12 사다리 = 나기정 대표님 "와인 리스트 12가지 분류 및 추천" (newwines 와 같은 표) */
window.LADDER10 = { no: 10, ko: '안달콤 · 가벼운 · 자몽 레몬 허브, 꽃', en: 'Dry / Light-bodied / Citrus, Herbal & Floral' };

window.CARDS = {
  'cloudy-bay-sb': {
    nameKo: '클라우디 베이 소비뇽 블랑',
    nameEn: 'Cloudy Bay Sauvignon Blanc',
    type: 'white',
    country: '뉴질랜드', region: '말보로 (Marlborough)',
    grape: '소비뇽 블랑 100%',
    size: '750ml',
    /* 12 사다리 10번: TOM 분류 (단맛 없음·가볍고 상큼·자몽 레몬 허브향) → 나기정 대표 확인 필요 */
    ladder: 10,
    ladderWhy: ['단맛 없이 깔끔해요 → <b>안달콤</b>', '입안이 가볍고 산뜻해요 → <b>가벼운</b>', '자몽·라임·풀 향이 먼저 와요 → <b>자몽 레몬 허브</b>'],
    words: ['자몽', '라임', '풋풋한 풀'],
    bars: { 당도: 1, 산도: 4, 바디: 2 },   // 1~5
    temp: '8~10℃',
    tempNote: '냉장고에서 꺼내 차갑게 따르면 향이 잘 살아요.',
    story: [
      '1985년, 뉴질랜드 남섬 북쪽 말보로에 와이너리가 문을 열었어요. 이 지역에 처음 생긴 와이너리 다섯 곳 가운데 하나였어요.',
      '그때만 해도 말보로를 와인 산지로 보는 사람은 거의 없었어요. 지금은 "뉴질랜드 소비뇽 블랑" 하면 이 이름이 먼저 나와요.'
    ],
    pairing: ['굴·해산물 요리', '샐러드·허브가 들어간 요리', '염소 치즈'],
    /* 탭샵바 판매가 미정. 국내 와인숍 비교는 판매가 확정 후 넣기 (외국 가격은 쓰지 않음)
       shop: { krw: TODO, note: '국내 온라인 와인숍 판매가, 날짜 확인' } */
    price: null,
    shop: null,
    tap: null // 이 와인을 탭으로 따르는 지점 (예: ['청계']). null = 준비 중
  }
};
