// js/audio.js
export const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// クリック/タップのユーザージェスチャで resume する（Safari/Chrome対策）
export function ensureAudioRunning() {
  if (audioCtx.state === "suspended") return audioCtx.resume();
  return Promise.resolve();
}

// マスター・チェーン（音量上げても耳が痛くなりにくい）
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.78;

const compressor = audioCtx.createDynamicsCompressor();
// パンチ出す設定（過度に割れない）
compressor.threshold.value = -18;
compressor.knee.value = 22;
compressor.ratio.value = 4.5;
compressor.attack.value = 0.006;
compressor.release.value = 0.16;

masterGain.connect(compressor);
compressor.connect(audioCtx.destination);

// 基本トーン（ADSR + LPF で“刺さらない”）
export function tone({
  freq = 440,
  dur = 0.12,
  type = "sawtooth",
  vol = 0.25,
  detune = 0,
  attack = 0.002,
  decay = 0.06,
  sustain = 0.45,
  release = 0.10,
  filterStart = 1600,
  filterEnd = 900
} = {}) {
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.detune.setValueAtTime(detune, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterStart, now);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(80, filterEnd),
    now + Math.max(0.01, dur)
  );
  filter.Q.setValueAtTime(0.9, now);

  // ADSR
  const peak = Math.max(0.001, vol);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(peak, now + attack);
  gain.gain.linearRampToValueAtTime(peak * sustain, now + attack + decay);
  gain.gain.setValueAtTime(peak * sustain, now + dur);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur + release);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + dur + release + 0.02);
}

// ノイズ・バースト（アタックの“バチッ”）
export function noiseBurst({ dur = 0.06, vol = 0.16, hp = 1200 } = {}) {
  const now = audioCtx.currentTime;
  const len = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
  const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1);

  const src = audioCtx.createBufferSource();
  src.buffer = buf;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(hp, now);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  src.start(now);
  src.stop(now + dur + 0.02);
}

// キック（低音ドン）
export function kick({ base = 90, dur = 0.14, vol = 0.32 } = {}) {
  // 低音が“出る”ようにサイン＋急降下
  tone({
    freq: base * 2.0,
    dur: dur,
    type: "sine",
    vol,
    attack: 0.001,
    decay: 0.03,
    sustain: 0.10,
    release: 0.08,
    filterStart: 1200,
    filterEnd: 300
  });
  // クリック感
  setTimeout(() => noiseBurst({ dur: 0.03, vol: 0.10, hp: 1800 }), 0);
}

// 和音（少しデチューンで厚み、ただし高すぎない）
export function chord(freqs, { dur = 0.18, vol = 0.18, type = "sawtooth" } = {}) {
  freqs.forEach((f, i) => {
    const det = (i - (freqs.length - 1) / 2) * 6; // -6,0,6 みたいに
    tone({ freq: f, dur, vol, type, detune: det, filterStart: 1600, filterEnd: 700 });
  });
  // アタックの気持ちよさをノイズで足す
  noiseBurst({ dur: 0.05, vol: 0.14, hp: 1400 });
}

// ライザー（上がってくる“期待”）
export function riser({ from = 220, to = 520, dur = 0.32, vol = 0.12 } = {}) {
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  osc.type = "sawtooth";

  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + dur);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(2400, now + dur);
  filter.Q.setValueAtTime(1.2, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(vol, now + dur * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + dur + 0.02);
}
