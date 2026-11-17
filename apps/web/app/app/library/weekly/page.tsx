"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { hasFeature, isoWeek, weeklySet, type ToddlerBand } from "@growlilo/game-core";
import { ParentGate } from "@/components/app/ParentGate";
import { WorksheetSheet } from "@/components/library/WorksheetSheet";
import { LockedNotice } from "@/components/library/PlanBadge";
import { ALL_WORKSHEETS } from "@/lib/content";
import { useLibrary } from "@/lib/library-store";
import { useReady } from "@/lib/store";

export default function WeeklyPage() {
  return <ParentGate reason="ชุดใบงานประจำสัปดาห์"><Weekly /></ParentGate>;
}

function Weekly() {
  const ready = useReady();
  const { plan } = useLibrary();
  const [band, setBand] = useState<ToddlerBand>("2-3");
  const now = useMemo(() => new Date(), []);
  const set = weeklySet(ALL_WORKSHEETS, band, now);
  const { week } = isoWeek(now);
  if (!ready) return <main className="screen screen--parent" aria-busy="true" />;
  return (
    <main className="screen screen--parent wsv">
      <nav className="pnav-top no-print"><Link href="/app/library/">← ห้องสมุด</Link></nav>
      <header className="no-print wsv__head">
        <p className="eyebrow-s">Family Plus • สัปดาห์ที่ {week}</p>
        <h1>ชุดใบงานประจำสัปดาห์</h1>
        <p className="muted">วันละแผ่นก็พอ ไม่ต้องทำครบ — เปลี่ยนชุดใหม่ทุกวันจันทร์</p>
      </header>
      {!hasFeature("weeklySet", plan) ? <LockedNotice what="ชุดใบงาน" /> : (
        <>
          <div className="wsv__actions no-print">
            {(["1-2", "2-3"] as ToddlerBand[]).map((b) => (
              <button key={b} className={`pill ${band === b ? "is-on" : ""}`} aria-pressed={band === b} onClick={() => setBand(b)}>{b.replace("-", "–")} ปี</button>
            ))}
            <button className="btn" onClick={() => window.print()} data-testid="print-weekly">พิมพ์ทั้ง {set.length} แผ่น</button>
          </div>
          <ol className="weekly-list no-print">{set.map((w) => <li key={w.id}><Link href={`/app/library/worksheet/${w.id}/`}>{w.title.th}</Link></li>)}</ol>
          <div className="print-area" data-testid="weekly-sheets">{set.map((w) => <WorksheetSheet key={w.id} ws={w} />)}</div>
        </>
      )}
    </main>
  );
}
