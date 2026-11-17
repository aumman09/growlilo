"use client";
import { useCallback, useSyncExternalStore } from "react";
import { emptyLibrary, parseLibrary, type LibraryState, type PlanSku } from "@growlilo/game-core";

/** Family library prefs (favourites, done marks, Plus demo flag). Device-local, no child data. */
export const LIBRARY_KEY = "growlilo:library:v1";
const SERVER = emptyLibrary();
let cache: LibraryState | null = null;
const subs = new Set<() => void>();

function read(): LibraryState {
  if (cache) return cache;
  try { cache = parseLibrary(JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? "null")); } catch { cache = emptyLibrary(); }
  return cache;
}
function subscribe(cb: () => void) {
  subs.add(cb);
  const on = (e: StorageEvent) => { if (e.key === LIBRARY_KEY) { cache = null; cb(); } };
  window.addEventListener("storage", on);
  return () => { subs.delete(cb); window.removeEventListener("storage", on); };
}

export function useLibrary() {
  const lib = useSyncExternalStore(subscribe, read, () => SERVER);
  const update = useCallback((fn: (s: LibraryState) => LibraryState) => {
    cache = fn(read());
    try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(cache)); } catch { /* keep in memory */ }
    for (const s of subs) s();
  }, []);
  /**
   * ALPHA: plan comes from a clearly-labelled local demo switch. This is NOT an entitlement and is
   * trivially changeable on the client — Phase 3 replaces it with a server-verified entitlement.
   */
  const plan: PlanSku = lib.plusDemo ? "family_plus" : "free";
  return { lib, update, plan };
}
