// js/effects.js
const card = document.getElementById("card");
let fxTimer = null;

export function clearFxClasses() {
  card.classList.remove(
    "fx-777",
    "fx-333",
    "fx-straight",
    "fx-zorome",
    "fx-pair",
    "fx-pair-7",
    "fx-pair-3",
    "fx-green",
    "fx-active"
  );
  if (fxTimer) {
    clearTimeout(fxTimer);
    fxTimer = null;
  }
}

export function applyFx(kind, ms = 1700) {
  clearFxClasses();
  card.classList.add("fx-active");
  if (kind) card.classList.add(kind);

  fxTimer = setTimeout(() => {
    clearFxClasses();
  }, ms);
}
