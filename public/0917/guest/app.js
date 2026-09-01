const SITE_PASSWORD = "20260917";

const macauRegistrationTimeline = [
  {
    day: "9月17日",
    label: "登记日",
    title: "嘉模圣母堂",
    detail: "我们会在澳门嘉模圣母堂举行结婚登记，10:30开始，请大家稍微早一点到～中午一起吃饭。",
    kind: "event",
  },
];

const guests = {
  "沈婉婷": {
    prep: "请务必随身带好港澳通行证原件，确认通行证仍在有效期内；还需要有有效的赴澳签注。你的赴澳签注还没办好，记得在珠海提前补办。",
    timeline: [
      { day: "9月16日", label: "出发", title: "CZ3690 · 南航", detail: "上海浦东 T2 → 珠海金湾，12:40–15:20。", kind: "travel" },,
      { day: "9月16日", label: "住宿", title: "珠海 · 格力香樟", detail: "1号楼 1302。", kind: "stay" },
      { day: "9月17日", label: "登记日", title: "一起进澳门", detail: "早上从珠海出发，前往嘉模圣母堂参加结婚登记。10:30开始，请稍微早一点到～", kind: "event" },,
      { day: "9月17日–19日", label: "住宿", title: "澳门 · 总统酒店", detail: "住两晚。", kind: "stay" },
      { day: "9月17日", label: "晚上", title: "朋友局", detail: "晚上一起吃饭、聊天。", kind: "meal" },
      { day: "9月19日", label: "回珠海", title: "澳门 → 珠海", detail: "从澳门回来后，继续住格力香樟。", kind: "travel" },
      { day: "9月21日", label: "回程", title: "CZ3755 · 南航", detail: "珠海金湾 → 上海浦东 T2，15:55–18:25。", kind: "travel" },
    ],
  },
  "陆童瑶": {
    prep: "请务必随身带好港澳通行证原件，确认通行证仍在有效期内，并提前确认已有有效的赴澳签注。",
    timeline: [
      { day: "9月16日", label: "出发", title: "SC2298 · 山航", detail: "上海虹桥 → 珠海金湾，21:35。", kind: "travel" },
      { day: "9月16日", label: "住宿", title: "珠海 · 香江维克酒店", detail: "拱北口岸店，住一晚。", kind: "stay" },
      { day: "9月17日", label: "登记日", title: "一起进澳门", detail: "早上前往嘉模圣母堂参加结婚登记。10:30开始，请稍微早一点到～", kind: "event" },
      { day: "9月17日–19日", label: "住宿", title: "澳门 · 骏龙酒店", detail: "住两晚。", kind: "stay" },
      { day: "9月17日", label: "晚上", title: "朋友局", detail: "晚上一起吃饭、聊天。", kind: "meal" },
      { day: "9月19日", label: "回程", title: "MU2056 / FM3004", detail: "澳门 → 上海虹桥，19:55。", kind: "travel" },
    ],
  },
  "邹馨玥": {
    prep: "请务必随身带好港澳通行证原件，确认通行证仍在有效期内，并提前确认已有有效的赴澳签注。",
    timeline: [
      { day: "9月16日", label: "出发", title: "SC2298 · 山航", detail: "上海虹桥 → 珠海金湾，21:35。", kind: "travel" },
      { day: "9月16日", label: "住宿", title: "珠海 · 香江维克酒店", detail: "拱北口岸店，住一晚。", kind: "stay" },
      { day: "9月17日", label: "登记日", title: "一起进澳门", detail: "早上前往嘉模圣母堂参加结婚登记。10:30开始，请稍微早一点到～", kind: "event" },
      { day: "9月17日–19日", label: "住宿", title: "澳门 · 骏龙酒店", detail: "住两晚。", kind: "stay" },
      { day: "9月17日", label: "晚上", title: "朋友局", detail: "晚上一起吃饭、聊天。", kind: "meal" },
      { day: "9月19日", label: "回程", title: "MU2056 / FM3004", detail: "澳门 → 上海虹桥，19:55。", kind: "travel" },
    ],
  },
  "塔塔": {
    prep: "请务必随身带好港澳通行证原件，确认通行证仍在有效期内，并提前确认每位同行家人都有有效的赴澳签注。",
    timeline: [
      { day: "出发前", label: "出发", title: "按自己的节奏来", detail: "从上海出发，抵达城市和日期可以自行安排。", kind: "travel" },
      { day: "9月17日", label: "登记日", title: "来澳门见我们", detail: "前往嘉模圣母堂参加登记，10:30开始，请稍微早一点到～水舞间门票已经为你们留好。", kind: "event" },,
      { day: "9月17日", label: "晚上", title: "朋友局", detail: "晚上一起吃饭、聊天。", kind: "meal" },
      { day: "全程", label: "住宿", title: "珠海 & 澳门", detail: "可按自己的行程安排；需要推荐时随时问我们。", kind: "stay" },
    ],
  },
  "沈健": {
    prep: "很遗憾爸爸妈妈没法来澳门参加这次登记，虽然你们不能到现场，但我们知道你们一直在牵挂着我们。爸爸先安心养伤，等装修好再来玩～",
    timeline: [],
  },
  "张丽敏": {
    prep: "很遗憾爸爸妈妈没法来澳门参加这次登记，虽然你们不能到现场，但我们知道你们一直在牵挂着我们。爸爸先安心养伤，等装修好再来玩～",
    timeline: [],
  },
  "不二的好朋友": {
    prep: "感谢你的一直陪伴～你的祝福我们都收到啦。也祝你有平安健康，喜乐常在～💓",
    timeline: [],
  },
  "布鲁的好朋友": {
    prep: "感谢你的一直陪伴～你的祝福我们都收到啦。也祝你有平安健康，喜乐常在～💓",
    timeline: [],
  },
  "颜艺辉": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
  "唐丽娜": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
  "爷爷": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
  "姑姑": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
  "奶奶": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
  "Vera": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
  "Richard": {
    prep: "",
    hideReminder: true,
    timeline: macauRegistrationTimeline,
  },
};

const loginView = document.querySelector("#login-view");
const guestView = document.querySelector("#guest-view");
const loginDialog = document.querySelector("#login-dialog");
const openLoginButton = document.querySelector("#open-login");
const form = document.querySelector("#login-form");
const error = document.querySelector("#form-error");
const guestNameInput = document.querySelector("#guest-name");

function renderTimeline(items) {
  const timeline = document.querySelector("#guest-timeline");
  const section = document.querySelector("#timeline-section");

  if (!items.length) {
    section.hidden = true;
    timeline.innerHTML = "";
    return;
  }

  section.hidden = false;
  timeline.innerHTML = items.map(({ day, label, title, detail, kind }) => `
    <article class="timeline-item timeline-item--${kind}">
      <p class="timeline-day">${day}</p>
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-copy">
        <p class="timeline-label">${label}</p>
        <h3>${title}</h3>
        <p>${detail}</p>
      </div>
    </article>
  `).join("");
}

function renderGuest(name) {
  const guest = guests[name];
  const hasTimeline = guest.timeline.length > 0;
  const reminderSection = document.querySelector(".reminder-section");
  const showReminder = !guest.hideReminder;
  document.querySelector("#guest-name-heading").textContent = name;
  reminderSection.hidden = !showReminder;
  if (showReminder) {
    document.querySelector("#guest-remark").textContent = guest.prep;
    document.querySelector("#reminder-label").textContent = hasTimeline ? "01 · BEFORE YOU GO" : "A LITTLE NOTE";
    document.querySelector("#reminder-title").textContent = hasTimeline ? "行前提醒" : "想对你们说";
  }
  renderTimeline(guest.timeline);
  loginDialog.close();
  loginView.hidden = true;
  guestView.hidden = false;
  document.body.classList.remove("login-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

openLoginButton.addEventListener("click", () => {
  loginDialog.showModal();
  guestNameInput.focus();
});

loginDialog.addEventListener("close", () => {
  error.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = guestNameInput.value.trim();
  if (document.querySelector("#invite-code").value !== SITE_PASSWORD) {
    error.textContent = "邀请码不正确，请核对后重试。";
    return;
  }
  if (!guests[name]) {
    error.textContent = "暂时没有找到这个姓名，请确认中文名。";
    return;
  }
  error.textContent = "";
  renderGuest(name);
});

const guestFromUrl = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("guest");
if (guestFromUrl && guests[guestFromUrl] && sessionStorage.getItem("0917-invite-access") === "granted") {
  renderGuest(guestFromUrl);
}

