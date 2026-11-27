// 지역 선택과 가게 검색

const STORE_COUNT = 10; // 보여줄 가게 수
const MAX_PAGE = 3; // 카카오맵 검색 결과를 최대 몇 쪽까지 볼지 (1쪽 = 15곳)
const ALL = ""; // "상관없음"

// 메뉴 이름 그대로는 검색이 잘 안 될 수 있어서 검색어를 따로 지정
const SEARCH_WORDS = {
  "계란말이와 밥": "백반",
  "라면과 김밥": "김밥",
  "떡볶이 세트": "떡볶이",
  "된장찌개 백반": "된장찌개",
  "매운 갈비찜": "매운갈비찜",
  "사천식 매운 훠궈": "훠궈",
  "토마토계란볶음": "중식당",
  "꽃빵과 고추잡채": "중식당",
  "일본식 카레": "일식카레",
  "토마토 파스타": "파스타",
  "크림 파스타": "파스타",
  "매운 투움바 파스타": "투움바 파스타",
  "감바스와 바게트": "감바스",
  "브런치 플레이트": "브런치",
  "양송이 수프": "브런치",
  "햄버거 세트": "햄버거",
  "곱창구이": "곱창",
  "막창구이": "막창",
  "대창구이": "대창",
  "목살구이": "목살",
  "한우구이": "한우",
  "중식 볶음면": "중식당",
  "핵불닭발": "매운닭발",
  "엽기떡볶이 매운맛": "엽기떡볶이",
  "골뱅이무침과 소면": "골뱅이",
  "치즈 불닭볶음면": "분식",
  "컵라면과 삼각김밥": "편의점",
  "먹태와 황태채": "먹태",
  "과일": "과일가게",
  "과자": "편의점",
  "빵": "베이커리",
};

let city = null; // 고른 시
let searchId = 0; // 마지막 검색만 화면에 반영하기 위한 번호
let sdkPromise = null;

function fillSelect(select, names) {
  const options = [["상관없음", ALL], ...[...names].sort((a, b) => a.localeCompare(b, "ko")).map((n) => [n, n])];
  select.replaceChildren(
    ...options.map(([label, value]) => {
      const option = document.createElement("option");
      option.textContent = label;
      option.value = value;
      return option;
    })
  );
  select.value = ALL;
}

// 구를 바꾸면 동 목록 갱신. 구가 "상관없음"이면 동은 고를 수 없어요.
function updateDongs() {
  const { districts, dongs } = REGIONS[city];
  const list = districts ? districts[$("gu").value] || [] : dongs;
  fillSelect($("dong"), list);
  $("dong").disabled = list.length === 0;
}

function selectCity(name) {
  city = name;
  const { districts } = REGIONS[city];
  $("gu-field").hidden = !districts;
  fillSelect($("gu"), districts ? Object.keys(districts) : []);
  updateDongs();
  $("region-detail").hidden = false;
  [...$("cities").children].forEach((button) => {
    button.className = button.textContent === city ? "option selected" : "option";
  });
}

function showRegion() {
  showView("region-view");
}

function currentArea() {
  const gu = REGIONS[city].districts ? $("gu").value : ALL;
  return { city, gu, dong: $("dong").value };
}

// 가게 주소(지번)가 고른 지역 안에 있는지 확인
function inArea(address, area) {
  const [first = "", ...rest] = address.split(" ");
  if (!REGIONS[area.city].prefixes.some((p) => first.startsWith(p))) return false;
  if (area.gu && !rest.includes(area.gu)) return false;
  if (!area.dong) return true;
  // "충무로" 는 "충무로1가" 도 포함. 숫자가 붙은 가/동만 허용해서 다른 동과 섞이지 않게 해요.
  const stem = area.dong;
  return rest.some(
    (word) => word === stem || (word.startsWith(stem) && /^(\d+가|\d+동|동\d+가|지구)?$/.test(word.slice(stem.length)))
  );
}

// 카카오맵 SDK 는 키가 있을 때만 불러오기
function loadKakao() {
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(KAKAO_JS_KEY)}&libraries=services&autoload=false`;
      script.onload = () => window.kakao.maps.load(resolve);
      script.onerror = () => {
        script.remove();
        sdkPromise = null; // 다음 검색에서 다시 시도
        reject(new Error("카카오맵을 불러오지 못했어요."));
      };
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
}

function searchPage(places, query, page) {
  return new Promise((resolve, reject) => {
    const { Status } = window.kakao.maps.services;
    places.keywordSearch(
      query,
      (data, status, pagination) => {
        if (status === Status.OK) resolve({ data, hasNext: pagination.hasNextPage });
        else if (status === Status.ZERO_RESULT) resolve({ data: [], hasNext: false });
        else reject(new Error("가게 검색에 실패했어요."));
      },
      { page, size: 15 }
    );
  });
}

async function findStores(query, area, foodOnly) {
  await loadKakao();
  const places = new window.kakao.maps.services.Places();
  const found = [];
  for (let page = 1; page <= MAX_PAGE && found.length < STORE_COUNT; page++) {
    const { data, hasNext } = await searchPage(places, query, page);
    found.push(
      ...data.filter(
        (place) =>
          inArea(place.address_name, area) &&
          // 식사 메뉴는 음식점(FD6)과 카페(CE7)만
          (!foodOnly || ["FD6", "CE7"].includes(place.category_group_code))
      )
    );
    if (!hasNext) break;
  }
  return found.slice(0, STORE_COUNT);
}

function storeItem(place) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.textContent = place.place_name;
  link.href = place.place_url;
  link.target = "_blank";
  link.rel = "noopener";
  const address = document.createElement("p");
  address.className = "sub";
  address.textContent = place.road_address_name || place.address_name;
  const info = document.createElement("p");
  info.className = "sub";
  info.textContent = [place.category_name.split(" > ").pop(), place.phone].filter(Boolean).join(" · ");
  item.replaceChildren(link, address, info);
  return item;
}

async function showStores() {
  const id = ++searchId;
  const area = currentArea();
  const areaText = [area.city, area.gu, area.dong].filter(Boolean).join(" ");
  const query = `${areaText} ${SEARCH_WORDS[chosen.name] || chosen.name}`;

  showView("store-view");
  $("store-title").textContent = `${chosen.emoji} ${areaText} · ${chosen.name}`;
  $("store-list").replaceChildren();
  $("kakao-link").href = `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
  $("naver-link").href = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;

  if (!KAKAO_JS_KEY) {
    $("store-status").textContent = "아래 버튼을 누르면 지도에서 바로 검색해요.";
    return;
  }

  $("store-status").textContent = "가게를 찾는 중이에요…";
  try {
    const found = await findStores(query, area, chosen.hunger !== "snack" && chosen.name !== "컵라면과 삼각김밥");
    if (id !== searchId) return;
    $("store-list").replaceChildren(...found.map(storeItem));
    $("store-status").textContent = found.length
      ? `카카오맵 검색 결과 ${found.length}곳 (평점순이 아니에요)`
      : "이 지역에서는 찾지 못했어요. 동이나 구를 '상관없음'으로 바꿔보세요.";
  } catch (error) {
    if (id !== searchId) return;
    $("store-status").textContent = `${error.message} 아래 지도 버튼을 이용해 주세요.`;
  }
}

// script.js 에서 $ 가 준비된 뒤에 호출해요.
function initRegions() {
  $("cities").replaceChildren(
    ...Object.keys(REGIONS).map((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.textContent = name;
      button.addEventListener("click", () => selectCity(name));
      return button;
    })
  );
  $("gu").addEventListener("change", updateDongs);
  $("search").addEventListener("click", showStores);
}
