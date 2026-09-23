/**
 * Synthesized cyberpunk sound effects for the Hack toggle.
 *
 * Uses the Web Audio API only — no audio files in the bundle. The
 * AudioContext is created lazily on first use because browsers require
 * a user gesture before audio can play, and we trigger these from a click.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

type BlipOptions = {
  freq: number;
  duration: number;
  delay?: number;
  type?: OscillatorType;
  volume?: number;
};

function blip({ freq, duration, delay = 0, type = "square", volume = 0.12 }: BlipOptions) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  const start = c.currentTime + delay;
  const end = start + duration;

  // Tiny attack to avoid a pop, then exponential decay.
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0005, end);

  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(end);
}

type SwooshOptions = {
  duration: number;
  delay?: number;
  startFreq: number;
  endFreq: number;
  q?: number;
  volume?: number;
};

function swoosh({ duration, delay = 0, startFreq, endFreq, q = 6, volume = 0.07 }: SwooshOptions) {
  const c = getCtx();

  // White noise buffer.
  const buffer = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * duration)), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const src = c.createBufferSource();
  src.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = q;

  const gain = c.createGain();

  const start = c.currentTime + delay;
  const end = start + duration;

  filter.frequency.setValueAtTime(startFreq, start);
  filter.frequency.exponentialRampToValueAtTime(endFreq, end);

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0005, end);

  src.connect(filter).connect(gain).connect(c.destination);
  src.start(start);
  src.stop(end);
}

/** Boot — rising sweep + four ascending square-wave beeps. ~650ms total. */
export function playBoot() {
  try {
    swoosh({ duration: 0.45, startFreq: 220, endFreq: 4500, volume: 0.08 });
    blip({ freq: 440, duration: 0.07, delay: 0.06, volume: 0.10 });
    blip({ freq: 660, duration: 0.07, delay: 0.18, volume: 0.10 });
    blip({ freq: 880, duration: 0.07, delay: 0.30, volume: 0.10 });
    blip({ freq: 1320, duration: 0.18, delay: 0.45, volume: 0.13 });
    // Soft sub-bass thump on the final note for "depth"
    blip({ freq: 65, duration: 0.25, delay: 0.45, type: "sine", volume: 0.18 });
  } catch {
    // If Web Audio is unavailable, silently no-op.
  }
}

/** Shutdown — descending beeps + falling sweep. ~600ms total. */
export function playShutdown() {
  try {
    blip({ freq: 880, duration: 0.07, delay: 0,    type: "square", volume: 0.10 });
    blip({ freq: 660, duration: 0.07, delay: 0.10, type: "square", volume: 0.10 });
    blip({ freq: 440, duration: 0.14, delay: 0.20, type: "square", volume: 0.10 });
    swoosh({ duration: 0.35, delay: 0.10, startFreq: 4500, endFreq: 90, volume: 0.07 });
    // Low fade-out hum at the very end
    blip({ freq: 90, duration: 0.30, delay: 0.30, type: "sine", volume: 0.15 });
  } catch {
    // ignore
  }
}

// ─── Smaller "ambient hacking" effects ───────────────────────────────────────

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Subtle keypress tick — fires on each input keystroke in the AI terminal. */
export function playKeypress() {
  try {
    blip({
      freq: rand(1400, 1700),
      duration: 0.025,
      type: "square",
      volume: 0.04,
    });
  } catch {}
}

/** Soft bleep for each AI response line — alternates two pitches per call. */
let aiToggle = false;
export function playAiBleep() {
  try {
    aiToggle = !aiToggle;
    blip({
      freq: aiToggle ? 660 : 880,
      duration: 0.06,
      type: "sine",
      volume: 0.08,
    });
    blip({
      freq: aiToggle ? 1320 : 1760,
      duration: 0.04,
      delay: 0.03,
      type: "sine",
      volume: 0.05,
    });
  } catch {}
}

/** Short static burst — fires alongside ghost-glitch shake. */
export function playGlitch() {
  try {
    swoosh({
      duration: 0.12,
      startFreq: rand(800, 1500),
      endFreq: rand(2500, 4000),
      q: 2,
      volume: 0.10,
    });
    blip({
      freq: rand(120, 200),
      duration: 0.08,
      type: "sawtooth",
      volume: 0.06,
    });
  } catch {}
}

/** Boot-flash log line tick — fast data click as each row appears. */
export function playLogTick() {
  try {
    blip({
      freq: rand(1100, 1400),
      duration: 0.025,
      type: "square",
      volume: 0.05,
    });
  } catch {}
}

/** Shutdown-flash line thunk — deeper than the boot tick. */
export function playShutdownTick() {
  try {
    blip({
      freq: rand(220, 320),
      duration: 0.05,
      type: "square",
      volume: 0.07,
    });
  } catch {}
}

// ─── Hover & streaming-typing helpers ────────────────────────────────────────

function isHackActive(): boolean {
  return typeof document !== "undefined" && document.body.dataset.hack === "true";
}

/** Quieter variant of playKeypress used by panels as they type themselves
 *  (AI terminal, Contact terminal, Mechanical title block). Self-scoped to
 *  hack mode so the static panels stay silent when Hack is off. */
export function playSoftKey() {
  if (!isHackActive()) return;
  try {
    blip({
      freq: rand(1300, 1700),
      duration: 0.018,
      type: "square",
      volume: 0.028,
    });
  } catch {}
}

/** Sonar-ping for hovering over interactive components. Throttled + scoped to
 *  hack mode so it never fires when hack is off. */
let lastHoverAt = 0;
const HOVER_THROTTLE_MS = 70;

export function playHoverPing() {
  if (!isHackActive()) return;
  const now = performance.now();
  if (now - lastHoverAt < HOVER_THROTTLE_MS) return;
  lastHoverAt = now;
  try {
    blip({ freq: 1200, duration: 0.04, type: "sine", volume: 0.05 });
    blip({ freq: 1800, duration: 0.05, delay: 0.025, type: "sine", volume: 0.035 });
  } catch {}
}
