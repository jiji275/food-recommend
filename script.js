// 단계 정의: 단계를 바꾸거나 추가하려면 이 배열을 수정하세요.
// key 는 menus.js 의 항목 이름과 연결돼요.
const STEPS = [
  {
    key: "meals",
    question: "어떤 끼니를 고를까요?",
    options: [
      { value: "breakfast", label: "🌅 아침" },
      { value: "lunch", label: "☀️ 점심" },
      { value: "dinner", label: "🌙 저녁" },
      // instant: 남은 단계를 건너뛰고 전체 메뉴에서 바로 뽑기
      { value: "any", label: "🎲 아무거나", instant: true },
    ],
  },
  {
    key: "hunger",
    question: "지금 얼마나 배고파요?",
    options: [
      { value: "heavy", label: "🤤 매우 배고픔" },
      { value: "light", label: "🙂 조금 배고픔" },
      { value: "snack", label: "😋 입이 심심함" },
    ],
  },
  {
    key: "spice",
    question: "맵찔이인가요? 어디까지 먹을 수 있어요?",
    // 고른 단계 "이하"의 맵기를 가진 메뉴가 모두 후보가 돼요.
    matches: (spice, level) => spice <= level,
    options: [
      { value: 0, label: "🥛 맵코찔찔이" },
      { value: 1, label: "🍜 신라면?" },
      { value: 2, label: "🔥 불닭?" },
      { value: 3, label: "💪 헐크" },
    ],
  },
  {
    key: "types",
    question: "어떤 종류가 끌려요?",
    options: [
      { value: "korean", label: "🇰🇷 한식" },
      { value: "chinese", label: "🥡 중식" },
      { value: "japanese", label: "🍣 일식" },
      { value: "western", label: "🍝 양식" },
      { value: "bunsik", label: "🍢 분식" },
      { value: "fastfood", label: "🍔 야식 & 패스트푸드" },
      { value: "etc", label: "🍗 기타" },
      { value: "any", label: "🤷 상관없음" },
    ],
  },
  {
    // 세부 종류: 한식 · 중식 · 일식을 골랐을 때만 나오는 단계
    key: "sub",
    question: "조금만 더 좁혀볼까요?",
    matches: (sub, value, selected) => sub[selected[TYPE_STEP].value] === value,
    options: (selected) => {
      const list = SUB_OPTIONS[selected[TYPE_STEP]?.value];
      return list ? [...list, { value: "any", label: "🤷 상관없음" }] : [];
    },
  },
];

const TYPE_STEP = 3; // STEPS 에서 "음식 종류" 단계의 위치 (0부터)

const NOODLE_OPTIONS = [
  { value: "noodle", label: "🍜 면" },
  { value: "nonoodle", label: "🍚 면X" },
];

// 종류별 세부 선택지. 여기에 없는 종류는 세부 단계를 건너뛰어요.
const SUB_OPTIONS = {
  korean: [
    { value: "pot", label: "🍲 뚝배기" },
    { value: "side", label: "🥢 반찬" },
    { value: "grill", label: "🥩 불판 (육류)" },
    { value: "noodle", label: "🍜 면" },
    { value: "etc", label: "🍱 기타" },
  ],
  chinese: NOODLE_OPTIONS,
  japanese: NOODLE_OPTIONS,
};

// 지금까지의 선택에 따라 index 번째 단계에서 보여줄 선택지
function getOptions(index, selected) {
  const step = STEPS[index];
  if (!step) return [];
  return typeof step.options === "function" ? step.options(selected) : step.options;
}

let answers = []; // 지금까지 고른 선택지
let candidates = []; // 결과 후보
let picks = []; // 지금 추천 중인 메뉴 (최대 2개)
let chosen = null; // 사용자가 고른 메뉴

const PICK_COUNT = 2;
const VIEWS = ["question-view", "result-view", "chosen-view", "region-view", "store-view"];

const $ = (id) => document.getElementById(id);

// 화면 하나만 보여주기
function showView(id) {
  VIEWS.forEach((view) => ($(view).hidden = view !== id));
}

// 선택한 조건에 맞는 메뉴만 남기기
function filterMenus(selected) {
  return MENUS.filter((item) =>
    selected.every((option, i) => {
      if (option.value === "any") return true;
      const { key, matches } = STEPS[i];
      const field = item[key];
      if (matches) return matches(field, option.value, selected);
      return Array.isArray(field) ? field.includes(option.value) : field === option.value;
    })
  );
}

function showStep() {
  const index = answers.length;
  const step = STEPS[index];

  showView("question-view");
  // 세부 단계는 필요할 때만 전체 단계 수에 포함
  const total = index > TYPE_STEP ? STEPS.length : TYPE_STEP + 1;
  $("progress").textContent = `${index + 1} / ${total} 단계`;
  $("question").textContent = step.question;
  $("back").hidden = index === 0;

  const buttons = getOptions(index, answers)
    // 해당하는 메뉴가 하나도 없는 선택지는 숨기기
    .filter((option) => filterMenus([...answers, option]).length > 0)
    .map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.textContent = option.label;
      button.addEventListener("click", () => choose(option));
      return button;
    });
  $("options").replaceChildren(...buttons);
}

function choose(option) {
  answers.push(option);
  if (option.instant || getOptions(answers.length, answers).length === 0) {
    candidates = filterMenus(answers);
    picks = [];
    drawPicks();
    showResult();
  } else {
    showStep();
  }
}

function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 새 메뉴 2개 뽑기. 직전에 나온 메뉴는 후보가 모자랄 때만 다시 써요.
function drawPicks() {
  const fresh = shuffle(candidates.filter((m) => !picks.includes(m)));
  picks = [...fresh, ...shuffle(picks)].slice(0, PICK_COUNT);
}

function showResult() {
  showView("result-view");
  $("summary").textContent = answers.map((a) => a.label).join("  ›  ");
  $("result-title").textContent =
    picks.length > 1 ? "둘 중에 하나 골라보세요!" : "조건에 맞는 메뉴는 이거예요!";
  $("retry").hidden = candidates.length <= PICK_COUNT;

  const cards = picks.map((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pick";
    const emoji = document.createElement("span");
    emoji.className = "pick-emoji";
    emoji.textContent = item.emoji;
    const name = document.createElement("strong");
    name.textContent = item.name;
    const hint = document.createElement("span");
    hint.className = "sub";
    hint.textContent = "이걸로 할래!";
    card.replaceChildren(emoji, name, hint);
    card.addEventListener("click", () => {
      chosen = item;
      showChosen();
    });
    return card;
  });
  $("picks").replaceChildren(...cards);
}

function showChosen() {
  showView("chosen-view");
  $("chosen-emoji").textContent = chosen.emoji;
  $("chosen-name").textContent = chosen.name;
}

function restart() {
  answers = [];
  showStep();
}

$("back").addEventListener("click", () => {
  answers.pop();
  showStep();
});
$("result-back").addEventListener("click", () => {
  answers.pop();
  showStep();
});
$("retry").addEventListener("click", () => {
  drawPicks();
  showResult();
});
$("restart").addEventListener("click", restart);
$("chosen-restart").addEventListener("click", restart);
$("store-restart").addEventListener("click", restart);
$("chosen-back").addEventListener("click", showResult);
$("stores").addEventListener("click", showRegion);
$("region-back").addEventListener("click", showChosen);
$("store-back").addEventListener("click", () => showView("region-view"));

initRegions();
showStep();
