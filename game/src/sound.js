// Tiny original WebAudio oscillator tones — no audio files. M toggles mute.
let ctx = null;
let muted = false;

export function isMuted() { return muted; }
export function toggleMute() { muted = !muted; return muted; }

function tone(freq, dur, type, gain, when = 0) {
  if (muted) return;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(gain || 0.08, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur);
  } catch { /* audio unavailable — stay silent */ }
}

export const sfx = {
  deal() { tone(520, 0.07, 'triangle', 0.05); tone(660, 0.07, 'triangle', 0.04, 0.05); },
  play() { tone(440, 0.09, 'triangle', 0.07); tone(587, 0.1, 'triangle', 0.06, 0.06); },
  strike() { tone(160, 0.18, 'sawtooth', 0.09); tone(90, 0.22, 'square', 0.06, 0.03); },
  ward() { tone(300, 0.12, 'sine', 0.07); tone(450, 0.12, 'sine', 0.05, 0.07); },
  win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.08, i * 0.11)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.07, i * 0.13)); },
};
