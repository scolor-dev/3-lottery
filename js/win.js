// js/win.js
import { applyFx } from "./effects.js";
import { kick, chord, tone, riser, noiseBurst } from "./audio.js";

/* =========================
   当たり音（高音頼みをやめて：低音＋厚み＋間）
========================= */
export function win777() {
  applyFx("fx-777", 2800);

  // 期待 → ドン → ドン → フィニッシュ（長め）
  riser({ from: 240, to: 520, dur: 0.26, vol: 0.14 });
  setTimeout(() => kick({ base: 90, dur: 0.16, vol: 0.34 }), 120);

  // 明るいメジャー和音（C E G / 低め中心）
  setTimeout(() => chord([261.6, 329.6, 392.0], { dur: 0.22, vol: 0.20, type: "sawtooth" }), 220);
  setTimeout(() => kick({ base: 95, dur: 0.16, vol: 0.34 }), 360);
  setTimeout(() => chord([392.0, 523.3, 659.3], { dur: 0.24, vol: 0.18, type: "sawtooth" }), 460);

  // 長めの“伸び”＋少しだけ上のキラ（高すぎない）
  setTimeout(() => chord([523.3, 659.3, 784.0], { dur: 0.32, vol: 0.16, type: "triangle" }), 720);
  setTimeout(() => tone({ freq: 1046.5, dur: 0.18, type: "sine", vol: 0.10, filterStart: 2200, filterEnd: 1400 }), 930);

  // 〆の低音
  setTimeout(() => tone({ freq: 130.8, dur: 0.28, type: "sine", vol: 0.16, filterStart: 600, filterEnd: 200 }), 1120);
}

export function win333() {
  applyFx("fx-333", 2700);

  // 333は“熱い”寄り：マイナー + 3連打（脈動）
  riser({ from: 200, to: 420, dur: 0.22, vol: 0.12 });
  setTimeout(() => kick({ base: 85, dur: 0.16, vol: 0.34 }), 120);

  // Aマイナー（A C E）を“タタタ”で
  const hit = (t) => {
    setTimeout(() => {
      chord([220.0, 261.6, 329.6], { dur: 0.18, vol: 0.20, type: "sawtooth" });
      kick({ base: 88, dur: 0.14, vol: 0.26 });
    }, t);
  };
  hit(230);
  hit(390);
  hit(550);

  // フィニッシュ：少し上に開く
  setTimeout(() => chord([329.6, 392.0, 523.3], { dur: 0.30, vol: 0.16, type: "triangle" }), 820);
  setTimeout(() => tone({ freq: 196.0, dur: 0.26, type: "sine", vol: 0.14, filterStart: 700, filterEnd: 240 }), 1080);
}

export function winStraight(type, a) {
  applyFx("fx-straight", 2000);

  // 連番は“駆け上がり/落ち”を音程差で感じる（高音に逃げない）
  if (type === "up") {
    riser({ from: 220, to: 520, dur: 0.20, vol: 0.11 });
    setTimeout(() => chord([220, 277, 330], { dur: 0.16, vol: 0.16, type: "sawtooth" }), 180);
    setTimeout(() => chord([277, 330, 415], { dur: 0.16, vol: 0.16, type: "sawtooth" }), 320);
    setTimeout(() => chord([330, 415, 494], { dur: 0.20, vol: 0.15, type: "triangle" }), 470);
  } else {
    // 降順：ドン→沈む
    kick({ base: 80, dur: 0.16, vol: 0.34 });
    setTimeout(() => chord([392, 311, 247], { dur: 0.18, vol: 0.16, type: "square" }), 220);
    setTimeout(() => tone({ freq: 165, dur: 0.22, type: "sine", vol: 0.14, filterStart: 700, filterEnd: 220 }), 520);
  }
}

export function winZorome(n) {
  applyFx("fx-zorome", 2200);

  // ゾロ目は“低音＋厚み＋短い上昇”で豪華に（耳が痛くない）
  riser({ from: 180 + n*8, to: 320 + n*12, dur: 0.18, vol: 0.10 });
  setTimeout(() => kick({ base: 80 + n*1.5, dur: 0.14, vol: 0.30 }), 140);

  // その数字に応じて中心音を少し変える（=当たりの個性）
  const root = 180 + n * 18;           // 低め中心
  const fifth = root * 1.5;
  const octave = root * 2.0;

  setTimeout(() => chord([root, fifth, octave], { dur: 0.22, vol: 0.18, type: "sawtooth" }), 240);
  setTimeout(() => chord([root*1.12, fifth*1.12, octave*1.12], { dur: 0.24, vol: 0.14, type: "triangle" }), 520);

  // 〆（短い“押し込み”）
  setTimeout(() => tone({ freq: root*0.75, dur: 0.22, type: "sine", vol: 0.14, filterStart: 700, filterEnd: 200 }), 820);
}

export function winPair(n) {
  applyFx("fx-pair", 1800);

  // 軽めの当たり：爽やかブルー系
  riser({ from: 220 + n*5, to: 380 + n*8, dur: 0.16, vol: 0.09 });

  // 透明感のある和音
  const root = 200 + n * 14;
  const third = root * 1.25;
  const fifth = root * 1.5;

  setTimeout(() => {
    chord([root, third, fifth], { dur: 0.20, vol: 0.15, type: "triangle" });
  }, 120);

  // 軽いキック
  setTimeout(() => {
    kick({ base: 75 + n, dur: 0.12, vol: 0.20 });
  }, 200);
}

export function winPair7() {
  applyFx("fx-pair-7", 2000);

  // 軽い777寄り演出
  riser({ from: 260, to: 520, dur: 0.18, vol: 0.12 });
  setTimeout(() => kick({ base: 95, dur: 0.14, vol: 0.28 }), 120);
  setTimeout(() => {
    chord([261.6, 329.6, 392.0], { dur: 0.22, vol: 0.18, type: "sawtooth" });
  }, 220);
}

export function winPair3() {
  applyFx("fx-pair-3", 1800);

  // 軽い333寄り演出（少し熱め）
  riser({ from: 200, to: 420, dur: 0.16, vol: 0.10 });
  setTimeout(() => kick({ base: 85, dur: 0.12, vol: 0.25 }), 120);
  setTimeout(() => kick({ base: 88, dur: 0.12, vol: 0.22 }), 240);
  setTimeout(() => {
    chord([220.0, 261.6, 329.6], { dur: 0.18, vol: 0.18, type: "square" });
  }, 300);
}

export function winGreen() {
  applyFx("fx-green", 1600);

  // 爽やかで軽い演出
  riser({ from: 180, to: 340, dur: 0.14, vol: 0.08 });

  setTimeout(() => {
    chord([196, 247, 294], { dur: 0.18, vol: 0.14, type: "triangle" });
  }, 120);

  setTimeout(() => {
    tone({ freq: 165, dur: 0.20, type: "sine", vol: 0.12 });
  }, 280);
}
