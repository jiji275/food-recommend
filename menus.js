// 메뉴 목록: 메뉴를 추가/수정할 때는 이 파일만 고치면 돼요.
// menu(이름, 이모지, 종류, 배고픔, 맵기, 끼니)
//
// 종류   : 띄어쓰기로 여러 개를 적으면 각 종류에 모두 나와요.
//          "korean", "chinese", "japanese", "western", "bunsik", "fastfood", "etc"
//          한식 · 중식 · 일식은 ":세부종류"를 꼭 붙여요. 예) "korean:grill fastfood"
//          한식      : pot(뚝배기), side(반찬), grill(불판), noodle(면), etc(기타)
//          중식·일식 : noodle(면), nonoodle(면X)
// 배고픔 : "heavy"(매우 배고픔), "light"(조금 배고픔), "snack"(입이 심심함)
// 맵기   : 0(안 매움), 1(신라면), 2(불닭), 3(헐크)
// 끼니   : B(아침), L(점심), D(저녁)

const B = "breakfast", L = "lunch", D = "dinner";

function menu(name, emoji, typeText, hunger, spice, meals) {
  const types = [];
  const sub = {};
  typeText.split(" ").forEach((part) => {
    const [type, detail] = part.split(":");
    types.push(type);
    if (detail) sub[type] = detail;
  });
  return { name, emoji, types, sub, hunger, spice, meals };
}

const MENUS = [
  // 한식 - 뚝배기
  menu("돼지국밥", "🍲", "korean:pot", "heavy", 0, [B, L, D]),
  menu("순대국밥", "🍲", "korean:pot", "heavy", 0, [B, L, D]),
  menu("뼈해장국", "🦴", "korean:pot", "heavy", 1, [B, L, D]),
  menu("김치찌개", "🥘", "korean:pot", "heavy", 1, [B, L, D]),
  menu("된장찌개 백반", "🍚", "korean:pot", "heavy", 0, [B, L, D]),
  menu("순두부찌개", "🥘", "korean:pot", "heavy", 1, [B, L, D]),
  menu("부대찌개", "🥘", "korean:pot", "heavy", 1, [L, D]),
  menu("갈비탕", "🍖", "korean:pot", "heavy", 0, [L, D]),
  menu("삼계탕", "🐔", "korean:pot", "heavy", 0, [L, D]),
  menu("설렁탕", "🥣", "korean:pot", "heavy", 0, [B, L, D]),
  menu("육개장", "🍲", "korean:pot", "heavy", 1, [B, L, D]),
  menu("감자탕", "🦴", "korean:pot fastfood", "heavy", 1, [L, D]),
  menu("콩나물국밥", "🥣", "korean:pot", "light", 0, [B, L]),

  // 한식 - 반찬 (밥과 함께 먹는 요리)
  menu("제육볶음", "🌶️", "korean:side", "heavy", 1, [L, D]),
  menu("불고기", "🥩", "korean:side", "heavy", 0, [L, D]),
  menu("찜닭", "🍗", "korean:side fastfood", "heavy", 1, [L, D]),
  menu("보쌈", "🥬", "korean:side fastfood", "heavy", 0, [L, D]),
  menu("족발", "🍖", "korean:side fastfood", "heavy", 0, [D]),
  menu("불족발", "🔥", "korean:side fastfood", "heavy", 2, [D]),
  menu("낙지볶음", "🐙", "korean:side", "heavy", 2, [L, D]),
  menu("오징어볶음", "🦑", "korean:side", "heavy", 1, [L, D]),
  menu("매운 갈비찜", "🌶️", "korean:side", "heavy", 2, [L, D]),
  menu("골뱅이무침과 소면", "🐚", "korean:side fastfood", "heavy", 1, [D]),
  menu("계란말이와 밥", "🍳", "korean:side", "light", 0, [B, L, D]),

  // 한식 - 불판 (육류)
  menu("삼겹살", "🥓", "korean:grill fastfood", "heavy", 0, [D]),
  menu("목살구이", "🥩", "korean:grill", "heavy", 0, [D]),
  menu("돼지갈비", "🍖", "korean:grill", "heavy", 0, [L, D]),
  menu("소갈비살", "🥩", "korean:grill", "heavy", 0, [D]),
  menu("한우구이", "🥩", "korean:grill", "heavy", 0, [D]),
  menu("오리구이", "🦆", "korean:grill", "heavy", 0, [L, D]),
  menu("닭갈비", "🍗", "korean:grill fastfood", "heavy", 1, [L, D]),
  menu("곱창구이", "🔥", "korean:grill fastfood", "heavy", 0, [D]),
  menu("막창구이", "🔥", "korean:grill fastfood", "heavy", 0, [D]),
  menu("대창구이", "🔥", "korean:grill fastfood", "heavy", 0, [D]),
  menu("닭발", "🐔", "korean:grill fastfood", "heavy", 2, [D]),
  menu("핵불닭발", "🌋", "korean:grill fastfood", "heavy", 3, [D]),

  // 한식 - 면
  menu("잔치국수", "🍜", "korean:noodle", "light", 0, [L, D]),
  menu("비빔국수", "🍜", "korean:noodle", "light", 1, [L, D]),
  menu("물냉면", "🍜", "korean:noodle", "light", 0, [L, D]),
  menu("비빔냉면", "🌶️", "korean:noodle", "light", 1, [L, D]),
  menu("칼국수", "🍜", "korean:noodle", "light", 0, [L, D]),
  menu("수제비", "🥣", "korean:noodle", "light", 0, [L, D]),
  menu("콩국수", "🥛", "korean:noodle", "light", 0, [L, D]),
  menu("밀면", "🍜", "korean:noodle", "heavy", 1, [L, D]),

  // 한식 - 기타
  menu("비빔밥", "🥗", "korean:etc", "heavy", 1, [L, D]),
  menu("죽", "🥣", "korean:etc", "light", 0, [B, D]),
  menu("누룽지", "🍚", "korean:etc", "light", 0, [B]),
  menu("약과", "🍪", "korean:etc", "snack", 0, [B, L, D]),
  menu("호떡", "🥞", "korean:etc bunsik", "snack", 0, [L, D]),
  menu("인절미", "🍡", "korean:etc", "snack", 0, [B, L, D]),

  // 중식 - 면
  menu("짜장면", "🍜", "chinese:noodle", "heavy", 0, [L, D]),
  menu("짬뽕", "🌶️", "chinese:noodle", "heavy", 1, [L, D]),
  menu("우육면", "🍜", "chinese:noodle", "heavy", 1, [L, D]),
  menu("탄탄면", "🥜", "chinese:noodle", "heavy", 1, [L, D]),
  menu("중식 볶음면", "🍝", "chinese:noodle", "heavy", 0, [L, D]),
  menu("울면", "🍜", "chinese:noodle", "heavy", 0, [L, D]),
  menu("완탕면", "🍜", "chinese:noodle", "light", 0, [B, L, D]),

  // 중식 - 면X
  menu("마라탕", "🍲", "chinese:nonoodle fastfood", "heavy", 2, [L, D]),
  menu("마라샹궈", "🌶️", "chinese:nonoodle fastfood", "heavy", 2, [L, D]),
  menu("사천식 매운 훠궈", "🔥", "chinese:nonoodle", "heavy", 3, [D]),
  menu("볶음밥", "🍛", "chinese:nonoodle", "heavy", 0, [B, L, D]),
  menu("잡채밥", "🍛", "chinese:nonoodle", "heavy", 0, [L, D]),
  menu("마파두부덮밥", "🍛", "chinese:nonoodle", "heavy", 1, [L, D]),
  menu("탕수육", "🍖", "chinese:nonoodle fastfood", "heavy", 0, [L, D]),
  menu("깐풍기", "🍗", "chinese:nonoodle fastfood", "heavy", 1, [D]),
  menu("유린기", "🍗", "chinese:nonoodle", "heavy", 0, [D]),
  menu("양꼬치", "🍢", "chinese:nonoodle fastfood", "heavy", 0, [D]),
  menu("딤섬", "🥟", "chinese:nonoodle", "light", 0, [B, L, D]),
  menu("토마토계란볶음", "🍅", "chinese:nonoodle", "light", 0, [B, L, D]),
  menu("꽃빵과 고추잡채", "🫑", "chinese:nonoodle", "light", 1, [L, D]),
  menu("꿔바로우", "🍤", "chinese:nonoodle fastfood", "snack", 0, [L, D]),
  menu("탕후루", "🍡", "chinese:nonoodle", "snack", 0, [L, D]),
  menu("월병", "🥮", "chinese:nonoodle", "snack", 0, [B, L, D]),

  // 일식 - 면
  menu("라멘", "🍜", "japanese:noodle", "heavy", 0, [L, D]),
  menu("매운 미소라멘", "🌶️", "japanese:noodle", "heavy", 2, [L, D]),
  menu("츠케멘", "🍜", "japanese:noodle", "heavy", 0, [L, D]),
  menu("야키소바", "🍝", "japanese:noodle", "heavy", 0, [L, D]),
  menu("우동", "🍢", "japanese:noodle bunsik", "light", 0, [B, L, D]),
  menu("메밀소바", "🍜", "japanese:noodle", "light", 0, [L, D]),

  // 일식 - 면X
  menu("돈까스", "🍱", "japanese:nonoodle western", "heavy", 0, [L, D]),
  menu("규동", "🍚", "japanese:nonoodle", "heavy", 0, [B, L, D]),
  menu("가츠동", "🍚", "japanese:nonoodle", "heavy", 0, [L, D]),
  menu("사케동", "🍣", "japanese:nonoodle", "heavy", 0, [L, D]),
  menu("텐동", "🍤", "japanese:nonoodle", "heavy", 0, [L, D]),
  menu("일본식 카레", "🍛", "japanese:nonoodle", "heavy", 1, [B, L, D]),
  menu("스키야키", "🍲", "japanese:nonoodle", "heavy", 0, [D]),
  menu("장어덮밥", "🍱", "japanese:nonoodle", "heavy", 0, [L, D]),
  menu("야키니쿠", "🥩", "japanese:nonoodle", "heavy", 0, [D]),
  menu("초밥", "🍣", "japanese:nonoodle", "light", 0, [L, D]),
  menu("오니기리", "🍙", "japanese:nonoodle", "light", 0, [B, L]),
  menu("오차즈케", "🍵", "japanese:nonoodle", "light", 0, [B, D]),
  menu("타코야키", "🐙", "japanese:nonoodle bunsik fastfood", "snack", 0, [L, D]),
  menu("모찌", "🍡", "japanese:nonoodle", "snack", 0, [B, L, D]),
  menu("타이야키", "🐟", "japanese:nonoodle", "snack", 0, [L, D]),

  // 양식
  menu("스테이크", "🥩", "western", "heavy", 0, [D]),
  menu("토마토 파스타", "🍝", "western", "heavy", 0, [L, D]),
  menu("크림 파스타", "🍝", "western", "heavy", 0, [L, D]),
  menu("매운 투움바 파스타", "🌶️", "western", "heavy", 1, [L, D]),
  menu("리조또", "🍛", "western", "heavy", 0, [L, D]),
  menu("함박스테이크", "🍽️", "western", "heavy", 0, [L, D]),
  menu("오므라이스", "🍳", "western bunsik", "heavy", 0, [B, L, D]),
  menu("라자냐", "🧀", "western", "heavy", 0, [L, D]),
  menu("바비큐 폭립", "🍖", "western fastfood", "heavy", 0, [D]),
  menu("감바스와 바게트", "🦐", "western", "heavy", 0, [D]),
  menu("피자", "🍕", "western fastfood", "heavy", 0, [L, D]),
  menu("햄버거 세트", "🍔", "western fastfood", "heavy", 0, [L, D]),
  menu("토스트", "🍞", "western", "light", 0, [B, L]),
  menu("샌드위치", "🥪", "western fastfood", "light", 0, [B, L, D]),
  menu("샐러드", "🥗", "western", "light", 0, [B, L, D]),
  menu("시리얼", "🥛", "western", "light", 0, [B]),
  menu("브런치 플레이트", "🍳", "western", "light", 0, [B, L]),
  menu("베이글", "🥯", "western", "light", 0, [B, L]),
  menu("양송이 수프", "🥣", "western", "light", 0, [B, L, D]),
  menu("핫도그", "🌭", "western fastfood", "light", 0, [B, L, D]),
  menu("맥모닝", "🍳", "western fastfood", "light", 0, [B]),
  menu("감자튀김", "🍟", "western fastfood", "snack", 0, [L, D]),
  menu("치즈볼", "🧀", "western fastfood", "snack", 0, [L, D]),
  menu("요거트", "🍨", "western", "snack", 0, [B, L, D]),
  menu("와플", "🧇", "western", "snack", 0, [B, L, D]),
  menu("치즈케이크", "🍰", "western", "snack", 0, [L, D]),

  // 분식
  menu("라면과 김밥", "🍜", "bunsik", "heavy", 1, [B, L, D]),
  menu("떡볶이 세트", "🌶️", "bunsik fastfood", "heavy", 1, [L, D]),
  menu("엽기떡볶이 매운맛", "🥵", "bunsik fastfood", "heavy", 3, [L, D]),
  menu("김밥", "🍙", "bunsik", "light", 0, [B, L, D]),
  menu("만두", "🥟", "bunsik chinese:nonoodle", "light", 0, [B, L, D]),
  menu("쫄면", "🍜", "bunsik korean:noodle", "light", 1, [L, D]),
  menu("순대", "🌭", "bunsik korean:etc fastfood", "snack", 0, [L, D]),
  menu("어묵", "🍢", "bunsik", "snack", 0, [B, L, D]),

  // 야식 & 패스트푸드
  menu("후라이드 치킨", "🍗", "fastfood western", "heavy", 0, [L, D]),
  menu("양념 치킨", "🍗", "fastfood korean:etc", "heavy", 1, [L, D]),
  menu("불닭 치킨", "🔥", "fastfood", "heavy", 2, [D]),
  menu("김피탕", "🧀", "fastfood", "heavy", 0, [D]),
  menu("부리토", "🌯", "fastfood western", "heavy", 1, [L, D]),
  menu("케밥", "🥙", "fastfood etc", "heavy", 0, [L, D]),
  menu("치즈 불닭볶음면", "🔥", "fastfood bunsik", "light", 2, [L, D]),
  menu("컵라면과 삼각김밥", "🍙", "fastfood bunsik", "light", 1, [B, L, D]),
  menu("타코", "🌮", "fastfood western", "light", 1, [L, D]),
  menu("치킨너겟", "🍗", "fastfood western", "snack", 0, [L, D]),
  menu("닭강정", "🍗", "fastfood bunsik", "snack", 1, [L, D]),
  menu("먹태와 황태채", "🐟", "fastfood", "snack", 0, [D]),
  menu("나초", "🌮", "fastfood western", "snack", 0, [L, D]),

  // 기타
  menu("쌀국수", "🍜", "etc", "light", 0, [B, L, D]),
  menu("과일", "🍎", "etc", "snack", 0, [B, L, D]),
  menu("아이스크림", "🍦", "etc", "snack", 0, [L, D]),
  menu("과자", "🍿", "etc", "snack", 0, [L, D]),
  menu("빵", "🥐", "etc", "snack", 0, [B, L, D]),
];
