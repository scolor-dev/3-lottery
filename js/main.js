// js/main.js
import { ensureAudioRunning } from "./audio.js";
import { startSpin, stopSpin, isSpinning } from "./slot.js";

const spinBtn = document.getElementById("spinBtn");
const stopBtn = document.getElementById("stopBtn");
const slotEl = document.querySelector(".slot");

// 最初のユーザー操作でAudioContextを起こす（脳汁音が鳴らない事故防止）
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

// 盤面クリックでトグル（元の挙動）
slotEl.addEventListener("click", () => {
  ensureAudioRunning();
  if (!isSpinning()) startSpin();
  else stopSpin();
});
