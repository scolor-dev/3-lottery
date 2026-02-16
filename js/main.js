// js/main.js
import { ensureAudioRunning } from "./audio.js";
import { startSpin, stopSpin, isSpinning } from "./slot.js";
import { initHistory } from "./history.js";

const spinBtn = document.getElementById("spinBtn");
const stopBtn = document.getElementById("stopBtn");
const slotEl = document.querySelector(".slot");

// 履歴の初期化
initHistory();

// 最初のユーザー操作でAudioContextを起こす（鳴らない事故防止）
document.body.addEventListener("click", () => {
  ensureAudioRunning();
}, { once: true });

spinBtn.addEventListener("click", () => {
  ensureAudioRunning();
  startSpin();
});

stopBtn.addEventListener("click", () => {
  ensureAudioRunning();
  stopSpin();
});

// 盤面クリックでトグル
slotEl.addEventListener("click", () => {
  ensureAudioRunning();
  if (!isSpinning()) startSpin();
  else stopSpin();
});
