"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProgress, useReady } from "@/lib/store";

export default function AppIndex() {
  const ready = useReady();
  const { state } = useProgress();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    router.replace(state.activeProfileId ? "/app/home/" : state.profiles.length ? "/app/select-child/" : "/app/welcome/");
  }, [ready, state, router]);
  return <div className="screen screen--loading" aria-busy="true" />;
}
