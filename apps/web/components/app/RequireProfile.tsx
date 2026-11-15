"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ChildProfile } from "@growlilo/game-core";
import { useActiveProfile, useReady } from "@/lib/store";

/** Child routes need a local profile; otherwise send the adult to onboarding. */
export function RequireProfile({ children }: { children: (p: ChildProfile) => React.ReactNode }) {
  const ready = useReady();
  const { state, profile } = useActiveProfile();
  const router = useRouter();
  useEffect(() => {
    if (!ready || profile) return;
    router.replace(state.profiles.length ? "/app/select-child/" : "/app/welcome/");
  }, [ready, profile, state.profiles.length, router]);
  if (!ready || !profile) return <div className="screen screen--loading" aria-busy="true" />;
  return <>{children(profile)}</>;
}
