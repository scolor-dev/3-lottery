// js/slot.js
import { noiseBurst, tone, riser } from "./audio.js";
import {
  win777,
  win333,
  winStraight,
  winZorome,
  winPair,
  winPair7,
  winPair3,
  winGreen
} from "./win.js";


/* =========================
   DOM
========================= */
const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");
const spinBtn = document.getElementById("spinBtn");
const stopBtn = document.getElementById("stopBtn");

/* =========================
   State
========================= */
let timers = [];
let spinning = false;

function randDigit() { return Math.floor(Math.random() * 10); }

/* =========================
   Public API
========================= */
export function isSpinning() {
  return spinning;
}

export function startSpin() {
  if (spinning) return;
  spinning = true;

  spinBtn.disabled = true;
  stopBtn.disabled = false;

  // 回転開始音（低めで“回り出す”感）
  riser({ from: 160, to: 280, dur: 0.18, vol: 0.10 });
  tone({ freq: 180, dur: 0.10, type: "square", vol: 0.14, filterStart: 900, filterEnd: 350 });

  const speeds = [45, 60, 75];
  timers = speeds.map((ms, idx) =>
    setInterval(() => {
      const x = randDigit();
      if (idx === 0) d1.textContent = x;
      if (idx === 1) d2.textContent = x;
      if (idx === 2) d3.textContent = x;
    }, ms)
  );
}

export function stopSpin() {
  if (!spinning) return;

  stopBtn.disabled = true;

  const stops = [200, 450, 700];
  stops.forEach((delay, idx) => {
    setTimeout(() => {
      clearInterval(timers[idx]);
      const final = randDigit();

      // 元コードの固定値（省略なしで維持）
      if (idx === 0) d1.textContent = final;
      if (idx === 1) d2.textContent = final;
      if (idx === 2) d3.textContent = final;

      // 停止音（高くしすぎず“カチッ”）
      noiseBurst({ dur: 0.03, vol: 0.09, hp: 1600 });
      tone({ freq: 520 + idx * 80, dur: 0.06, type: "square", vol: 0.12, filterStart: 1200, filterEnd: 700 });

      if (idx === 2) {
        spinning = false;
        spinBtn.disabled = false;
        checkWin();
      }
    }, delay);
  });
}

/* =========================
   Helpers
========================= */
function getDigits() {
  return [Number(d1.textContent), Number(d2.textContent), Number(d3.textContent)];
}

function getStraightType([a,b,c]) {
  if (b === a + 1 && c === b + 1) return "up";
  if (b === a - 1 && c === b - 1) return "down";
  return null;
}

function checkWin() {
  const [a,b,c] = getDigits();

  // 3つ揃い
  if (a === 7 && b === 7 && c === 7) return win777();
  if (a === 3 && b === 3 && c === 3) return win333();

  // 連番
  const straight = getStraightType([a,b,c]);
  if (straight) return winStraight(straight, a);

  // ゾロ目
  if (a === b && b === c) return winZorome(a);

  // ペア
  if (
    (a === b && b !== c) ||
    (a === c && b !== a) ||
    (b === c && a !== b)
  ) {
    const pairNum =
      a === b ? a :
      a === c ? a :
      b;

    if (pairNum === 7) return winPair7();
    if (pairNum === 3) return winPair3();
    return winPair(pairNum);
  }

  // ★ どれにも該当せず、3を含む
  if (a === 3 || b === 3 || c === 3) {
    return winGreen();
  }
}
