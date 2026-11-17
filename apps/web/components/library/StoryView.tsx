"use client";
import Link from "next/link";
import { useMemo } from "react";
import { canAccess, visibleItems } from "@growlilo/game-core";
import { ParentGate } from "@/components/app/ParentGate";
import { StoryPlayer } from "./StoryPlayer";
import { LockedNotice, TierChip } from "./PlanBadge";
import { getStory, THEME_TH } from "@/lib/content";
import { useLibrary } from "@/lib/library-store";
import { useReady } from "@/lib/store";

export function StoryView({ id }: { id: string }) {
  return <ParentGate reason="นิทานสำหรับครอบครัว"><View id={id} /></ParentGate>;
}

function View({ id }: { id: string }) {
  const ready = useReady();
  const story = getStory(id)!;
  const { plan } = useLibrary();
  const now = useMemo(() => new Date(), []);
  if (!ready) return <main className="screen screen--parent" aria-busy="true" />;
  const published = visibleItems([story], now).length === 1;
  return (
    <main className="screen screen--parent storyv">
      <nav className="pnav-top"><Link href="/app/library/">← ห้องสมุด</Link></nav>
      <header className="wsv__head">
        <TierChip tier={story.access_tier} />
        <h1>{story.title.th}</h1>
        <p className="muted"><span lang="en">{story.title.en}</span> • {THEME_TH[story.theme] ?? story.theme} • ประมาณ {story.minutes} นาที</p>
      </header>
      {!published ? <p className="empty">นิทานเรื่องนี้จะเผยแพร่วันที่ {story.published_at}</p>
        : !canAccess(story, plan) ? <LockedNotice what="นิทาน" />
        : <StoryPlayer story={story} />}
    </main>
  );
}
