"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { canAccess, hasFeature, visibleItems } from "@growlilo/game-core";
import { ParentGate } from "@/components/app/ParentGate";
import { StoryPlayer } from "@/components/library/StoryPlayer";
import { LockedNotice } from "@/components/library/PlanBadge";
import { ALL_STORIES } from "@/lib/content";
import { useLibrary } from "@/lib/library-store";
import { useReady } from "@/lib/store";

export default function PlaylistPage() {
  return <ParentGate reason="เพลย์ลิสต์ก่อนนอน"><Playlist /></ParentGate>;
}

/** Plays favourites in order, then stops — a finite playlist, never endless autoplay. */
function Playlist() {
  const ready = useReady();
  const { lib, plan } = useLibrary();
  const now = useMemo(() => new Date(), []);
  const [i, setI] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const list = visibleItems(ALL_STORIES, now).filter((s) => canAccess(s, plan));
  const queue = lib.favorites.map((id) => list.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  if (!ready) return <main className="screen screen--parent" aria-busy="true" />;
  return (
    <main className="screen screen--parent storyv">
      <nav className="pnav-top"><Link href="/app/library/">← ห้องสมุด</Link></nav>
      <header className="wsv__head">
        <p className="eyebrow-s">Family Plus</p>
        <h1>เพลย์ลิสต์นิทานก่อนนอน</h1>
        <p className="muted">เล่นต่อกัน {queue.length} เรื่อง แล้วหยุดเอง • ตั้งเวลาปิดเสียงได้ในตัวเล่น</p>
      </header>
      {!hasFeature("playlist", plan) ? <LockedNotice what="เพลย์ลิสต์" />
        : queue.length === 0 ? <p className="empty">ยังไม่มีนิทานในเพลย์ลิสต์ — กดรูปหัวใจในหน้านิทานเพื่อเพิ่ม</p>
        : done ? (
          <div className="pcard pcard--center"><h2>จบเพลย์ลิสต์แล้ว ราตรีสวัสดิ์</h2><button className="btn" onClick={() => { setDone(false); setI(0); setStarted(false); }}>เริ่มใหม่</button></div>
        ) : (
          <>
            <ol className="weekly-list">{queue.map((s, k) => <li key={s.id} className={k === i ? "is-now" : ""}>{s.title.th}</li>)}</ol>
            {!started ? <button className="btn btn--lg" onClick={() => setStarted(true)} data-testid="start-playlist">เริ่มเล่นเพลย์ลิสต์</button>
              : <StoryPlayer key={queue[i].id} story={queue[i]} autoStart onFinished={() => (i + 1 < queue.length ? setI(i + 1) : setDone(true))} />}
          </>
        )}
    </main>
  );
}
