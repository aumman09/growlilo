"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { emptyState, parseState, type ProgressState } from "@growlilo/game-core";

/**
 * Local progress store (Phase 1). Behind this tiny interface so it can move to IndexedDB (Phase 2)
 * and API sync (Phase 3) without touching pages. NOT secure identity storage (PRD §11.1).
 */
export const STORAGE_KEY = "growlilo:v1";
const SERVER_SNAPSHOT = emptyState();
let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function read(): ProgressState {
  if (cache) return cache;
  try {
    cache = parseState(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    cache = emptyState();
  }
  return cache;
}

function emit() { for (const l of listeners) l(); }

export function writeState(next: ProgressState): boolean {
  cache = next;
  let ok = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    ok = false; // quota / private mode: keep in memory for this session
  }
  emit();
  return ok;
}

export function clearAll() {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  cache = emptyState();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) { cache = null; cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, read, () => SERVER_SNAPSHOT);
  const update = useCallback((fn: (s: ProgressState) => ProgressState) => writeState(fn(read())), []);
  return { state, update };
}

/** True after the first client render — use before redirecting based on stored state. */
export function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useActiveProfile() {
  const { state, update } = useProgress();
  const profile = state.profiles.find((p) => p.id === state.activeProfileId) ?? null;
  return { state, update, profile };
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const set = () => setOnline(navigator.onLine);
    set();
    window.addEventListener("online", set);
    window.addEventListener("offline", set);
    return () => { window.removeEventListener("online", set); window.removeEventListener("offline", set); };
  }, []);
  return online;
}
