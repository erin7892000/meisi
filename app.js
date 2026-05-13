const buttonsWithScroll = document.querySelectorAll("[data-scroll-target]");
const buttonsWithToggle = document.querySelectorAll("[data-toggle-target]");
const filterButtons = document.querySelectorAll("[data-filter]");
const dayCards = document.querySelectorAll(".day-card");
const copyButtons = document.querySelectorAll("[data-copy-text]");
const mapButtons = document.querySelectorAll("[data-map-query]");
const navButtons = document.querySelectorAll(".bottom-nav button");
const toast = document.getElementById("toast");
const mealStayOrder = ["breakfast", "lunch", "dinner", "stay"];
const mealStayLabels = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  stay: "住宿",
};
const mealStayData = [
  {
    breakfast: "機上供餐為主，落地後如果還有精神，可以在飯店附近找一間輕食店補充熱食。",
    lunch: "跨日飛行日先不硬排午餐，優先完成入境、領行李與交通接駁。",
    dinner: "如果抵達時間偏晚，建議直接在飯店周邊簡單吃，讓第一晚節奏放鬆一點。",
    stay: "示意住宿：SFO 機場線或市區交通方便的飯店，重點是接駁順和可早點休息。",
  },
  {
    breakfast: "可先找 Union Square 或纜車站附近的咖啡店，方便接續市區移動。",
    lunch: "中午可排在漁人碼頭周邊，吃完就能直接接下午海邊與港區行程。",
    dinner: "晚餐建議留在碼頭或 North Beach 一帶，減少晚上再跨區折返。",
    stay: "示意住宿延續舊金山市區，這天不換飯店最省力。",
  },
  {
    breakfast: "早餐以飯店或機場快速解決為主，保留更多彈性給移動與登機時間。",
    lunch: "若班機時間卡中午，可在轉移途中簡單吃；今天重點不是找餐廳，而是順利進 Vegas。",
    dinner: "抵達 Vegas 後可把晚餐安排在飯店或主要大道附近，接著早點休息。",
    stay: "示意住宿：Las Vegas Strip 周邊，方便隔天取車出發 Page。",
  },
  {
    breakfast: "建議一早在 Vegas 先吃飽再上路，峽谷段補給點比較零散。",
    lunch: "午餐可抓在途中加油站城市或 Page 入城後，避免壓縮羚羊谷導覽時段。",
    dinner: "晚餐適合安排在 Page 市區，回飯店後就不再移動，隔天也比較好出發。",
    stay: "示意住宿：Page 住宿一晚，優先選停車方便、隔天能快速銜接大峽谷路線的地點。",
  },
  {
    breakfast: "今天可能要早出發，建議以前一天先買好的輕食或飯店早餐為主。",
    lunch: "中午可在大峽谷園區內簡單補給，保留更多時間給觀景點停留。",
    dinner: "若傍晚還在移動，就先以順路餐廳為主，不特別追求目的地型晚餐。",
    stay: "示意住宿：大峽谷周邊或回程路線上的中繼住宿，這裡先看版型，不先鎖正式名單。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "晚餐可作為 Vegas 回程後的彈性放鬆時段，之後再補正式清單。",
    stay: "示意住宿：拉斯維加斯再住一晚，方便隔天銜接前往 LA。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "中途可找順路休息站或進 LA 前補一餐，避免傍晚塞車時又餓又累。",
    dinner: "如果天文台看夜景，晚餐可放在 Griffith Observatory 或附近區域處理。",
    stay: "示意住宿：洛杉磯市區或西邊交通方便區域，方便後兩天景點分配。",
  },
  {
    breakfast: "樂園日建議提早吃，進場後比較能把時間留給熱門設施。",
    lunch: "午餐直接留在園區內機動處理，避免頻繁進出影響排隊節奏。",
    dinner: "晚餐可抓在遊行或煙火前後的空檔，這天主打方便而不是正式餐廳。",
    stay: "示意住宿延續洛杉磯同一間，避免樂園日再換房。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "午餐可視購物區域調整，重點是不要把下午全部卡死在單一點位。",
    dinner: "既有行程已設定聖莫尼卡海灘晚餐，這裡可作為正式版優先保留項目。",
    stay: "示意住宿延續洛杉磯同一間，最後一晚以隔天去機場順路為主。",
  },
  {
    breakfast: "返程日可在飯店或機場快速處理早餐，保留足夠時間還車與報到。",
    lunch: "若航班時間在中午後，可在機場內簡單吃；若時間緊，就以登機前補給為主。",
    dinner: "此日以航班供餐或轉機補給為主，不另外安排外部晚餐。",
    stay: "此日無住宿安排，返程移動為主。",
  },
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function buildMealStayPreview(card, index) {
  const detail = card.querySelector(".drawer");
  const top = card.querySelector(".day-top");
  const expandButton = card.querySelector(".expand-button");
  if (!detail || !top || !expandButton || card.querySelector(".day-detail-panel")) return;

  const data = mealStayData[index] ?? {};

  const topActions = document.createElement("div");
  topActions.className = "day-top-actions";

  const mealActions = document.createElement("div");
  mealActions.className = "day-meal-actions";
  mealActions.setAttribute("role", "tablist");
  mealActions.setAttribute("aria-label", "餐宿資訊切換");

  expandButton.parentElement?.removeChild(expandButton);
  topActions.appendChild(expandButton);
  topActions.appendChild(mealActions);
  top.appendChild(topActions);

  const panel = document.createElement("section");
  panel.className = "day-detail-panel hidden";
  panel.setAttribute("aria-live", "polite");

  const title = document.createElement("p");
  title.className = "day-detail-title";

  const body = document.createElement("p");
  body.className = "day-detail-body";

  panel.append(title, body);

  const render = (key) => {
    panel.classList.remove("hidden");
    title.textContent = mealStayLabels[key];
    body.textContent = data[key] || `此日尚未安排${mealStayLabels[key]}。`;
    mealActions.querySelectorAll(".day-detail-button").forEach((button) => {
      const isActive = button.dataset.detailKey === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  };

  mealStayOrder.forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-detail-button";
    button.dataset.detailKey = key;
    button.textContent = mealStayLabels[key];
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.addEventListener("click", () => render(key));
    mealActions.appendChild(button);
  });

  detail.insertAdjacentElement("afterend", panel);
  card.renderMealStayPreview = render;
}

dayCards.forEach((card, index) => buildMealStayPreview(card, index));

function applyMealPreviewMode() {
  const search = window.location?.search ?? "";
  const params = new URLSearchParams(search);
  if (params.get("preview") !== "meals") return;

  const firstCard = dayCards[0];
  if (!firstCard) return;

  const detail = firstCard.querySelector(".drawer");
  if (detail) {
    detail.classList.remove("hidden");
  }

  const expandButton = firstCard.querySelector(".expand-button");
  if (expandButton) {
    expandButton.textContent = "收起";
  }

  if (typeof firstCard.renderMealStayPreview === "function") {
    firstCard.renderMealStayPreview("stay");
  }

  const daysSection = document.getElementById("days");
  if (daysSection) {
    window.requestAnimationFrame(() => {
      daysSection.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }
}

applyMealPreviewMode();

buttonsWithScroll.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTarget);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

buttonsWithToggle.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.toggleTarget);
    if (!panel) return;

    const isHidden = panel.classList.toggle("hidden");
    if (button.classList.contains("expand-button")) {
      button.textContent = isHidden ? "查看" : "收起";
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    const currentFilter = button.dataset.filter;
    dayCards.forEach((card) => {
      const matches = currentFilter === "all" || card.dataset.category === currentFilter;
      card.style.display = matches ? "" : "none";
    });
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copyText;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`已複製：${text}`);
    } catch {
      showToast("這台裝置暫時無法複製");
    }
  });
});

mapButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const query = button.dataset.mapQuery;
    if (!query) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});

const sections = ["summary", "flights", "days", "notes"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navButtons.forEach((button) => {
        const isCurrent = button.dataset.scrollTarget === entry.target.id;
        button.classList.toggle("is-current", isCurrent);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => observer.observe(section));
