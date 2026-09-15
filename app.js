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
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "此日尚未安排晚餐；20:00 抵達 SFO 後以入住休息為主。",
    stay: "Hotel Zephyr，San Francisco。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "16:00 Fog Harbor Fish House。",
    stay: "Hotel Zephyr，San Francisco。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "此日尚未安排晚餐。",
    stay: "MGM Hotel，Las Vegas；9/20 入住、9/21 退房。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "此日尚未安排晚餐。",
    stay: "Holiday Inn Express & Suites Page – Lake Powell Area by IHG；9/21 入住。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "此日尚未安排晚餐。",
    stay: "Holiday Inn Express & Suites Page – Lake Powell Area by IHG；續住一晚。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "此日尚未安排晚餐。",
    stay: "神劍飯店（Excalibur Hotel），Las Vegas。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "此日尚未安排晚餐。",
    stay: "DoubleTree by Hilton Hotel Pasadena。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐；可依 Disneyland 園區動線補上。",
    dinner: "此日尚未安排晚餐。",
    stay: "DoubleTree by Hilton Hotel Pasadena。",
  },
  {
    breakfast: "此日尚未安排早餐。",
    lunch: "此日尚未安排午餐。",
    dinner: "20:00 Enterprise 還車後前往 LAX，晚餐依機場報到時間彈性安排。",
    stay: "不住宿；9/27 00:05 起飛，9/26 晚間前往機場。",
  },
  {
    breakfast: "此日以機上供餐為主。",
    lunch: "此日以機上供餐為主。",
    dinner: "此日以機上供餐為主。",
    stay: "此日無住宿，00:05 自 LAX 起飛返台。",
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
