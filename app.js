const STORAGE_KEY = "iri-c-empathy-quiz-v1";
const MAX_ITEM_SCORE = 4;

// 中文版人际反应指针量表（IRI-C），共22题。
// reverse=true 的题目按 4 - 原始答案反向计分。
const questions = [
  { text: "对那些比我不幸的人，我经常有心软和关怀的感觉。", dimension: "EC" },
  { text: "有时候当其他人有困难或问题时，我并不为他们感到很难过。", dimension: "EC", reverse: true },
  { text: "我的确会投入小说人物中的感情世界。", dimension: "FS" },
  { text: "在紧急状况中，我感到担忧、害怕而难以平静。", dimension: "PD" },
  { text: "看电影或看戏时，我通常是旁观的，而且不经常全心投入。", dimension: "FS", reverse: true },
  { text: "在做决定前，我试着从争论中去看每个人的立场。", dimension: "PT" },
  { text: "当我看到有人被别人利用时，我有点感到想要保护他们。", dimension: "EC" },
  { text: "当我处在一个情绪非常激动的情况中时，我往往会感到无依无靠，不知如何是好。", dimension: "PD" },
  { text: "有时候我想象从我的朋友的观点来看事情的样子，以便更了解他们。", dimension: "PT" },
  { text: "对我来说，全心地投入一本好书或一部好电影中，是很少有的事。", dimension: "FS", reverse: true },
  { text: "其他人的不幸通常不会带给我很大的烦忧。", dimension: "EC", reverse: true },
  { text: "看完戏或电影之后，我会觉得自己好像是剧中的某一个角色。", dimension: "FS" },
  { text: "处在紧张情绪的状况中，我会惊慌害怕。", dimension: "PD" },
  { text: "当我看到有人受到不公平的对待时，我有时并不感到非常同情他们。", dimension: "EC", reverse: true },
  { text: "我相信每个问题都有两面观点，所以我常试着从不同的观点来看问题。", dimension: "PT" },
  { text: "我认为自己是一个相当软心肠的人。", dimension: "EC" },
  { text: "当我观赏一部好电影时，我很容易站在某个主角的立场去感受他的心情。", dimension: "FS" },
  { text: "在紧急状况中，我紧张得几乎无法控制自己。", dimension: "PD" },
  { text: "当我对一个人生气时，我通常会试着去想一下他的立场。", dimension: "PT" },
  { text: "当我阅读一篇引人的故事或小说时，我想象着：如果故事中的事件发生在我身上，我会感觉怎么样？", dimension: "FS" },
  { text: "当我看到有人发生意外而极需帮助的时候，我紧张得几乎精神崩溃。", dimension: "PD" },
  { text: "在批评别人前，我会试着想象：假如我处在他的情况，我的感受如何？", dimension: "PT" },
];

const choices = [
  { label: "完全不同意", value: 0 },
  { label: "不同意", value: 1 },
  { label: "不确定", value: 2 },
  { label: "同意", value: 3 },
  { label: "完全同意", value: 4 },
];

const dimensions = {
  PT: { label: "观点采择", detail: "主动站在他人的角度理解想法与处境" },
  FS: { label: "想象代入", detail: "对故事或虚构人物产生情感代入" },
  EC: { label: "共情关注", detail: "对他人的不幸产生关怀与保护倾向" },
  PD: {
    label: "个人忧伤",
    detail: "面对紧张情境时产生焦虑和不适的程度",
    caution: "此维度越高，表示越容易被压力淹没",
  },
};

const resultProfiles = [
  {
    min: 75,
    level: "共情倾向较突出",
    title: "你很容易走进他人的感受",
    summary: "你通常能敏锐感知他人的处境，并愿意投入理解与关怀。",
    body: "你在换位思考、情感代入或关怀他人方面表现得较为主动。共情是你的重要资源，但真正可持续的共情也需要清晰边界，避免把别人的情绪全部背在自己身上。",
    advice: "保留你的敏感与善意，同时练习区分“理解他人”和“替他人承担”。当情绪负荷过高时，可以先暂停、命名自己的感受，再决定要提供怎样的帮助。",
  },
  {
    min: 50,
    level: "共情倾向较平衡",
    title: "你会靠近，也能保留观察距离",
    summary: "你能够理解他人的感受，同时通常不会完全被情绪带走。",
    body: "你的共情反应会随对象和情境变化：熟悉的人、具体的故事或强烈的情绪更容易触发你的共鸣。四个维度的差异，比单一总分更能说明你的共情方式。",
    advice: "遇到分歧时，可以多问一句“如果从对方的位置看，会发生什么？”；遇到强烈情绪时，也记得检查自己的承受程度。理解与边界可以同时存在。",
  },
  {
    min: 0,
    level: "共情倾向仍在发展",
    title: "你更习惯从自己的位置理解世界",
    summary: "你可能更依靠事实和直接信息，不容易自然进入他人的情绪。",
    body: "较低的量表得分不等于冷漠，也可能与表达习惯、当下压力或自我保护有关。你可以重点查看四个维度，找到相对擅长与较少使用的共情通道。",
    advice: "从可验证的小练习开始：复述对方表达的事实、猜测一种可能的感受，再向对方确认。不要急着给建议，先确保自己真正听懂了对方。",
  },
];

const elements = {
  intro: document.querySelector("#introScreen"),
  quiz: document.querySelector("#quizScreen"),
  result: document.querySelector("#resultScreen"),
  start: document.querySelector("#startButton"),
  startText: document.querySelector("#startButtonText"),
  back: document.querySelector("#backButton"),
  question: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  progressLabel: document.querySelector("#progressLabel"),
  progressPercent: document.querySelector("#progressPercent"),
  progressTrack: document.querySelector("#progressTrack"),
  progressFill: document.querySelector("#progressFill"),
  restartHeader: document.querySelector("#restartHeaderButton"),
  retry: document.querySelector("#retryButton"),
  copy: document.querySelector("#copyButton"),
  scoreRing: document.querySelector("#scoreRing"),
  scoreValue: document.querySelector("#scoreValue"),
  resultLevel: document.querySelector("#resultLevel"),
  resultSummary: document.querySelector("#resultSummary"),
  insightTitle: document.querySelector("#insightTitle"),
  insightBody: document.querySelector("#insightBody"),
  dimensionList: document.querySelector("#dimensionList"),
  advice: document.querySelector("#adviceText"),
  toast: document.querySelector("#toast"),
};

let state = loadState();
let transitionTimer;
let toastTimer;

function blankState() {
  return { index: 0, answers: Array(questions.length).fill(null), completed: false };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || !Array.isArray(parsed.answers) || parsed.answers.length !== questions.length) return blankState();
    const answers = parsed.answers.map((value) => (choices.some((choice) => choice.value === value) ? value : null));
    const firstUnanswered = answers.findIndex((value) => value === null);
    return {
      index: firstUnanswered === -1 ? questions.length - 1 : firstUnanswered,
      answers,
      completed: Boolean(parsed.completed) && firstUnanswered === -1,
    };
  } catch {
    return blankState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showScreen(name) {
  [elements.intro, elements.quiz, elements.result].forEach((screen) => screen.classList.remove("is-active"));
  elements[name].classList.add("is-active");
  elements.restartHeader.classList.toggle("hidden", name === "intro");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const current = state.index;
  const progress = Math.round(((current + 1) / questions.length) * 100);
  elements.question.textContent = questions[current].text;
  elements.progressLabel.textContent = `问题 ${current + 1} / ${questions.length}`;
  elements.progressPercent.textContent = `${progress}%`;
  elements.progressFill.style.width = `${progress}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(current + 1));
  elements.back.disabled = current === 0;
  elements.options.replaceChildren();

  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    const isSelected = state.answers[current] === choice.value;
    button.type = "button";
    button.className = `option-button${isSelected ? " is-selected" : ""}`;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(isSelected));
    button.innerHTML = `<span class="option-number">${index + 1}</span><span>${choice.label}<small>（${choice.value}）</small></span>`;
    button.addEventListener("click", () => selectAnswer(choice.value));
    elements.options.append(button);
  });
}

function selectAnswer(value) {
  window.clearTimeout(transitionTimer);
  state.answers[state.index] = value;
  saveState();
  renderQuestion();
  transitionTimer = window.setTimeout(() => {
    if (state.index === questions.length - 1) {
      state.completed = true;
      saveState();
      renderResult();
      showScreen("result");
      return;
    }
    state.index += 1;
    saveState();
    renderQuestion();
  }, 260);
}

function scoreAnswer(question, answer) {
  return question.reverse ? MAX_ITEM_SCORE - answer : answer;
}

function calculateScores() {
  const dimensionScores = Object.fromEntries(
    Object.keys(dimensions).map((key) => [key, { raw: 0, count: 0, percentage: 0 }]),
  );
  let total = 0;
  questions.forEach((question, index) => {
    const score = scoreAnswer(question, state.answers[index]);
    total += score;
    dimensionScores[question.dimension].raw += score;
    dimensionScores[question.dimension].count += 1;
  });
  Object.values(dimensionScores).forEach((dimension) => {
    dimension.percentage = Math.round((dimension.raw / (dimension.count * MAX_ITEM_SCORE)) * 100);
  });
  return {
    total,
    percentage: Math.round((total / (questions.length * MAX_ITEM_SCORE)) * 100),
    dimensions: dimensionScores,
  };
}

function renderResult() {
  const scores = calculateScores();
  const profile = resultProfiles.find((item) => scores.percentage >= item.min) ?? resultProfiles.at(-1);
  elements.scoreValue.textContent = String(scores.percentage);
  elements.scoreRing.style.setProperty("--score-angle", `${scores.percentage * 3.6}deg`);
  elements.resultLevel.textContent = profile.level;
  elements.resultSummary.textContent = `${profile.summary} 原始总分 ${scores.total} / ${questions.length * MAX_ITEM_SCORE}。`;
  elements.insightTitle.textContent = profile.title;
  elements.insightBody.textContent = profile.body;
  elements.advice.textContent = profile.advice;
  elements.dimensionList.replaceChildren();

  Object.entries(dimensions).forEach(([key, dimension]) => {
    const score = scores.dimensions[key];
    const maximum = score.count * MAX_ITEM_SCORE;
    const row = document.createElement("div");
    row.className = "dimension-row";
    row.innerHTML = `
      <div class="dimension-head"><span>${dimension.label}</span><strong>${score.raw} / ${maximum}</strong></div>
      <div class="dimension-track"><div class="dimension-fill" style="width: ${score.percentage}%"></div></div>
      <p class="dimension-detail">${dimension.detail}${dimension.caution ? `；${dimension.caution}` : ""}</p>
    `;
    elements.dimensionList.append(row);
  });
}

function restart() {
  window.clearTimeout(transitionTimer);
  state = blankState();
  localStorage.removeItem(STORAGE_KEY);
  elements.startText.textContent = "开始测试";
  showScreen("intro");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
}

async function copyResult() {
  const scores = calculateScores();
  const detail = Object.entries(dimensions)
    .map(([key, dimension]) => `${dimension.label}：${scores.dimensions[key].raw}/${scores.dimensions[key].count * MAX_ITEM_SCORE}`)
    .join("\n");
  const text = `${elements.resultLevel.textContent}｜共情综合指数 ${scores.percentage}\n${detail}\n\n本结果来自 IRI-C 自评量表，仅用于自我观察，不构成心理诊断。`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("结果已复制");
  } catch {
    showToast("复制失败，请手动截图保存");
  }
}

elements.start.addEventListener("click", () => {
  if (state.completed) {
    renderResult();
    showScreen("result");
    return;
  }
  renderQuestion();
  showScreen("quiz");
});

elements.back.addEventListener("click", () => {
  if (state.index === 0) return;
  window.clearTimeout(transitionTimer);
  state.index -= 1;
  saveState();
  renderQuestion();
});

elements.retry.addEventListener("click", restart);
elements.restartHeader.addEventListener("click", restart);
elements.copy.addEventListener("click", copyResult);

document.addEventListener("keydown", (event) => {
  if (!elements.quiz.classList.contains("is-active")) return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < choices.length) selectAnswer(choices[index].value);
});

if (state.completed) {
  elements.startText.textContent = "查看上次结果";
} else if (state.answers.some((answer) => answer !== null)) {
  elements.startText.textContent = "继续上次测试";
}

