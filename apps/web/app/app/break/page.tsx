"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RequireProfile } from "@/components/app/RequireProfile";
import { Lilo } from "@/components/brand/Mascots";
import { getLesson, getMission, MISSIONS } from "@/lib/content";
import { useProgress } from "@/lib/store";

const BREATHS = 3;

export default function BreakPage() {
  return <RequireProfile>{(p) => <Break profileId={p.id} ageBand={p.ageBand} />}</RequireProfile>;
}

function Break({ profileId, ageBand }: { profileId: string; ageBand: string }) {
  const { state } = useProgress();
  const [breath, setBreath] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const resting = breath < BREATHS;

  useEffect(() => {
    if (!resting) return;
    const t = window.setTimeout(() => {
      if (phase === "in") setPhase("out");
      else { setPhase("in"); setBreath((b) => b + 1); }
    }, 2500);
    return () => window.clearTimeout(t);
  }, [phase, resting]);

  // Mission follows the last lesson played; otherwise a gentle default that fits the age band.
  const last = [...state.attempts].reverse().find((a) => a.profileId === profileId);
  const linked = last ? getLesson(last.lessonId)?.linked_mission_id : null;
  const mission = (linked && getMission(linked)) || MISSIONS.find((m) => m.age_bands.includes(ageBand as never)) || MISSIONS[0];

  return (
    <main className="screen screen--child brk">
      {resting ? (
        <section className="rest" aria-live="polite">
          <p className="rest__kicker">พักสายตากันนะ</p>
          <div className={`rest__leaf rest__leaf--${phase}`} aria-hidden><Lilo size={140} expr="calm" /></div>
          <h1>{phase === "in" ? "หายใจเข้า…" : "หายใจออก…"}</h1>
          <p className="rest__sub">มองไปไกล ๆ นอกหน้าจอ ({Math.min(breath + 1, BREATHS)}/{BREATHS})</p>
          <button className="rest__skip" onClick={() => setBreath(BREATHS)} data-testid="skip-rest">ข้าม</button>
        </section>
      ) : (
        <section className="mcard" aria-labelledby="mtitle" data-testid="mission-card">
          <span className="mcard__tag">ภารกิจนอกจอ • {mission.duration_minutes} นาที</span>
          <Lilo size={110} wave />
          <h1 id="mtitle">{mission.title.th}</h1>
          <p className="mcard__do">{mission.child_instruction.th}</p>
          {mission.id === "mission-find-red-001" && (
            <div className="slots" aria-hidden><span /><span /><span /></div>
          )}
          <p className="mcard__adult">ให้พ่อแม่ดูวิธีเล่นและกดยืนยันเมื่อทำเสร็จ</p>
          <Link className="btn btn--lg btn--block" href={`/app/mission/${mission.id}/`} data-testid="to-mission">ให้พ่อแม่ดูภารกิจ</Link>
          <Link className="done__home" href="/app/home/">กลับหน้าหลัก</Link>
        </section>
      )}
    </main>
  );
}
