// js/history.js
const STORAGE_KEY = "slot_history_v1";
const MAX_ITEMS = 20;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function nowTimeStr() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function labelFor(kind) {
  switch (kind) {
    case "777": return { text: "777", cls: "gold" };
    case "333": return { text: "333", cls: "red" };
    case "straight_up": return { text: "連番↑", cls: "purple" };
    case "straight_down": return { text: "連番↓", cls: "purple" };
    case "zorome": return { text: "ゾロ目", cls: "orange" };
    case "pair7": return { text: "77x", cls: "gold" };
    case "pair3": return { text: "33x", cls: "red" };
    case "pair": return { text: "ペア", cls: "blue" };
    case "green": return { text: "3含む", cls: "green" };
    case "lose": return { text: "ハズレ", cls: "gray" };
    default: return { text: kind ?? "?", cls: "gray" };
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // localStorageが使えない環境でも動作は継続
  }
}

function updateCount(countEl, items) {
  if (!countEl) return;
  countEl.textContent = `${items.length}/${MAX_ITEMS}`;
}

function render(listEl, items) {
  listEl.innerHTML = "";
  items.forEach((it) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const badge = document.createElement("span");
    const { text, cls } = labelFor(it.kind);
    badge.className = `badge ${cls}`;
    badge.textContent = text;

    const digits = document.createElement("span");
    digits.textContent = `${it.digits.join("")}`;

    const time = document.createElement("span");
    time.style.marginLeft = "auto";
    time.style.color = "rgba(15,23,42,.55)";
    time.textContent = it.time;

    li.appendChild(badge);
    li.appendChild(digits);
    li.appendChild(time);

    listEl.appendChild(li);
  });
}

export function initHistory() {
  const listEl = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearHistoryBtn");
  const countEl = document.getElementById("historyCount");
  if (!listEl || !clearBtn) return;

  let items = load();
  render(listEl, items);
  updateCount(countEl, items); // 初期表示

  function push(kind, digits) {
    const entry = { kind, digits, time: nowTimeStr() };
    items = [entry, ...items].slice(0, MAX_ITEMS);
    save(items);
    render(listEl, items);
    updateCount(countEl, items); // 追加後
  }

  clearBtn.addEventListener("click", () => {
    items = [];
    save(items);
    render(listEl, items);
    updateCount(countEl, items); // クリア後（0/MAX）
  });

  // slot.js から dispatch されるイベントを受け取る
  window.addEventListener("slot:result", (ev) => {
    const detail = ev?.detail;
    if (!detail || !Array.isArray(detail.digits)) return;
    push(detail.kind ?? "lose", detail.digits);
  });
}
