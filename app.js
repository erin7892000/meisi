const buttonsWithScroll = document.querySelectorAll("[data-scroll-target]");
const buttonsWithToggle = document.querySelectorAll("[data-toggle-target]");
const filterButtons = document.querySelectorAll("[data-filter]");
const dayCards = document.querySelectorAll(".day-card");
const copyButtons = document.querySelectorAll("[data-copy-text]");
const mapButtons = document.querySelectorAll("[data-map-query]");
const navButtons = document.querySelectorAll(".bottom-nav button");
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

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
