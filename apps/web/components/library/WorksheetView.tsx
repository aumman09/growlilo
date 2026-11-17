"use client";
import Link from "next/link";
import { useMemo } from "react";
import { canAccess, visibleItems } from "@growlilo/game-core";
import { ParentGate } from "@/components/app/ParentGate";
import { WorksheetSheet } from "./WorksheetSheet";
import { LockedNotice, TierChip } from "./PlanBadge";
import { getWorksheet, SKILL_TH } from "@/lib/content";
import { useLibrary } from "@/lib/library-store";
import { useReady } from "@/lib/store";

export function WorksheetView({ id }: { id: string }) {
  return <ParentGate reason="ใบงานสำหรับพิมพ์"><View id={id} /></ParentGate>;
}

function View({ id }: { id: string }) {
  const ready = useReady();
  const ws = getWorksheet(id)!;
  const { lib, update, plan } = useLibrary();
  const now = useMemo(() => new Date(), []);
  if (!ready) return <main className="screen screen--parent" aria-busy="true" />;
  const published = visibleItems([ws], now).length === 1;
  const open = canAccess(ws, plan);
  const done = lib.worksheetsDone[ws.id];

  return (
    <main className="screen screen--parent wsv">
      <nav className="pnav-top no-print"><Link href="/app/library/">← ห้องสมุด</Link></nav>
      <header className="no-print wsv__head">
        <TierChip tier={ws.access_tier} />
        <h1>{ws.title.th} <span className="muted" lang="en">({ws.title.en})</span></h1>
        <p className="muted">{SKILL_TH[ws.skill]} • {ws.age_bands.map((b) => b.replace("-", "–")).join(", ")} ปี • ประมาณ {ws.minutes} นาที • อุปกรณ์: {ws.materials.join(", ")}</p>
      </header>
      {!published ? (
        <p className="empty">ใบงานนี้จะเผยแพร่วันที่ {ws.published_at}</p>
      ) : !open ? (
        <LockedNotice what="ใบงาน" />
      ) : (
        <>
          <div className="wsv__actions no-print">
            <button className="btn btn--lg" onClick={() => window.print()} data-testid="print">พิมพ์ / บันทึกเป็น PDF</button>
            <button className="btn btn--ghost" onClick={() => update((s) => ({ ...s, worksheetsDone: { ...s.worksheetsDone, [ws.id]: new Date().toISOString() } }))} disabled={!!done} data-testid="mark-done">
              {done ? "ทำแล้ว ✓" : "ทำกับลูกแล้ว"}
            </button>
          </div>
          <div className="wsv__tips no-print">
            <h2>วิธีเล่นกับลูก</h2>
            <ul>{ws.adult_tips.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className="safety" role="note"><h2>ข้อควรระวัง</h2><ul>{ws.safety.map((s) => <li key={s}>{s}</li>)}</ul></div>
          </div>
          <div className="print-area"><WorksheetSheet ws={ws} /></div>
        </>
      )}
    </main>
  );
}
