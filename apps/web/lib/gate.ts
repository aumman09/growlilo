"use client";
import { GATE_UNLOCK_MS } from "@growlilo/game-core";

const KEY = "growlilo:gate-until";

export function isGateUnlocked(now = Date.now()): boolean {
  try { return Number(window.sessionStorage.getItem(KEY) ?? 0) > now; } catch { return false; }
}
export function unlockGate(now = Date.now()) {
  try { window.sessionStorage.setItem(KEY, String(now + GATE_UNLOCK_MS)); } catch { /* ignore */ }
}
export function lockGate() {
  try { window.sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
