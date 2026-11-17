"use client";
import { useLibrary } from "@/lib/library-store";

/** Alpha-only switch, clearly labelled. Not a purchase, not an entitlement. */
export function PlusDemoSwitch() {
  const { lib, update } = useLibrary();
  return (
    <label className="demo-switch">
      <input type="checkbox" checked={lib.plusDemo} onChange={() => update((s) => ({ ...s, plusDemo: !s.plusDemo }))} data-testid="plus-demo" />
      <span>
        <b>ทดลองดู Family Plus (Demo)</b>
        <small>สำหรับรุ่นทดลองเท่านั้น — ยังไม่มีการชำระเงินจริง</small>
      </span>
    </label>
  );
}

export function TierChip({ tier, isNew }: { tier: "free" | "plus"; isNew?: boolean }) {
  return (
    <span className="tier">
      {isNew && <span className="chip chip--peach">ใหม่</span>}
      <span className={`chip ${tier === "free" ? "chip--leaf" : "chip--blue"}`}>{tier === "free" ? "ฟรี" : "Plus"}</span>
    </span>
  );
}

export function LockedNotice({ what }: { what: string }) {
  return (
    <div className="locked" role="note" data-testid="locked">
      <h2>{what}นี้อยู่ใน Family Plus</h2>
      <p className="muted">Family Plus ยังไม่เปิดชำระเงิน — ระหว่างนี้ใช้ของที่ติดป้าย “ฟรี” ได้ทั้งหมด หรือเปิดโหมดทดลองด้านล่างเพื่อดูตัวอย่าง</p>
      <PlusDemoSwitch />
    </div>
  );
}
