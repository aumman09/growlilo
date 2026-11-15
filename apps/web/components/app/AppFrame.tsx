"use client";
import { useEffect } from "react";
import { useActiveProfile, useOnline } from "@/lib/store";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const online = useOnline();
  const { profile } = useActiveProfile();
  const reduce = profile?.settings.reducedMotion ?? false;
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduce);
    return () => document.documentElement.classList.remove("reduce-motion");
  }, [reduce]);
  return (
    <div className="app">
      {!online && (
        <div className="offline-chip" role="status" data-testid="offline-chip">
          <span aria-hidden className="offline-chip__dot" /> ออฟไลน์ — เกมที่โหลดแล้วยังเล่นได้
        </div>
      )}
      {children}
    </div>
  );
}
