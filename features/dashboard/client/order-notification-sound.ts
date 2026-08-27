"use client";

function tone(ctx: AudioContext, frequency: number, startTime: number, duration: number) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  // Short linear fade in/out so the tone doesn't click at its start/end.
  const peak = 0.18;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peak, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(peak, startTime + duration - 0.03);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/**
 * Two-tone "new order" chime (800Hz then 1000Hz), synthesized with the Web
 * Audio API so no audio file needs to ship. Silently no-ops if Web Audio
 * isn't available or the browser blocks audio before a user gesture — a
 * missed beep is a low-stakes failure, the toast still shows regardless.
 */
export function playOrderNotificationSound() {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const now = ctx.currentTime;
    tone(ctx, 800, now, 0.16);
    tone(ctx, 1000, now + 0.17, 0.18);
    setTimeout(() => ctx.close(), 500);
  } catch {
    // ignore — see doc comment above
  }
}
