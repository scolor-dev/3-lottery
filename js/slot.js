// js/slot.js
import { noiseBurst, tone, riser } from "./audio.js";
import { clearFxClasses } from "./effects.js";
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
  clearFxClasses();
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
  const [a, b, c] = getDigits();

  // kind を決める（履歴用）
  let kind = "lose";

  // 3つ揃い
  if (a === 7 && b === 7 && c === 7) kind = "777";
  else if (a === 3 && b === 3 && c === 3) kind = "333";
  else {
    // 連番
    const straight = getStraightType([a, b, c]);
    if (straight === "up") kind = "straight_up";
    else if (straight === "down") kind = "straight_down";
    else {
      // ゾロ目（777/333以外）
      if (a === b && b === c) kind = "zorome";
      else {
        // ペア
        const isPair =
          (a === b && b !== c) ||
          (a === c && b !== a) ||
          (b === c && a !== b);

        if (isPair) {
          const pairNum =
            a === b ? a :
            a === c ? a :
            b;

          if (pairNum === 7) kind = "pair7";
          else if (pairNum === 3) kind = "pair3";
          else kind = "pair";
        } else {
          // どれにも該当せず、3を含む
          if (a === 3 || b === 3 || c === 3) kind = "green";
        }
      }
    }
  }

  // 演出（kind に応じて呼ぶ）
  switch (kind) {
    case "777": win777(); break;
    case "333": win333(); break;
    case "straight_up": winStraight("up", a); break;
    case "straight_down": winStraight("down", a); break;
    case "zorome": winZorome(a); break;
    case "pair7": winPair7(); break;
    case "pair3": winPair3(); break;
    case "pair": {
      // 元の winPair は数字で音が変わる想定なので渡す
      const pairNum =
        (a === b) ? a :
        (a === c) ? a :
        b;
      winPair(pairNum);
      break;
    }
    case "green": winGreen(); break;
    case "lose":
    default:
      // ハズレは前回色を残さない
      clearFxClasses();
      break;
  }

  // 履歴へ通知（CustomEvent）
  window.dispatchEvent(new CustomEvent("slot:result", {
    detail: { kind, digits: [a, b, c] }
  }));
}
