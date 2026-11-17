"use client";
/**
 * Audio helpers. English speech uses the browser's Web Speech API as an alpha stand-in
 * for licensed native recordings (DECISIONS D4). Captions are always shown, so audio is never required.
 */
let ctx: AudioContext | null = null;

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
}

export function speak(text: string, lang: "en-US" | "th-TH" = "en-US", rate = 0.85): void {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.1;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    /* audio is optional */
  }
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/** Gentle synthesized tones (no audio assets → no licensing). */
export function chime(kind: "correct" | "try" | "done"): void {
  if (typeof window === "undefined") return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    const notes = kind === "correct" ? [660, 880] : kind === "done" ? [523, 659, 784] : [392];
    const t0 = ctx.currentTime;
    notes.forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = t0 + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(kind === "try" ? 0.05 : 0.08, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(ctx!.destination);
      o.start(t);
      o.stop(t + 0.4);
    });
  } catch {
    /* ignore */
  }
}

/** Speaks and resolves when finished (or after an estimate if speech is unavailable). */
export function speakAsync(text: string, lang: "en-US" | "th-TH", rate = 0.9): { done: Promise<void>; cancel: () => void } {
  let cancelled = false;
  let timer: number | undefined;
  const done = new Promise<void>((resolve) => {
    const fallback = () => { timer = window.setTimeout(resolve, Math.max(1800, text.length * 90)); };
    if (!canSpeak()) { fallback(); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      const v = window.speechSynthesis.getVoices().find((x) => x.lang === lang) ?? window.speechSynthesis.getVoices().find((x) => x.lang.startsWith(lang.slice(0, 2)));
      if (v) u.voice = v;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
      // Safety net: some engines never fire onend.
      timer = window.setTimeout(resolve, Math.max(6000, text.length * 160));
    } catch { fallback(); }
  });
  return {
    done: done.then(() => { if (timer) window.clearTimeout(timer); if (cancelled) throw new Error("cancelled"); }),
    cancel: () => { cancelled = true; if (timer) window.clearTimeout(timer); stopSpeaking(); },
  };
}
