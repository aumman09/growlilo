"use client";
import Link from "next/link";
import { ParentGate } from "@/components/app/ParentGate";
import { PLAN_CATALOG } from "@/lib/content";
import { useOnline } from "@/lib/store";

const fmt = (minor: number) => new Intl.NumberFormat("th-TH").format(minor / 100);

export default function Billing() {
  const online = useOnline();
  const plus = PLAN_CATALOG.plans.find((p) => p.sku === "family_plus")!;
  return (
    <ParentGate reason="แพ็กและการชำระเงิน">
      <main className="screen screen--parent">
        <nav className="pnav-top"><Link href="/app/parent/">← แดชบอร์ด</Link></nav>
        <article className="pcard" data-testid="billing">
          <p className="eyebrow-s">แพ็กปัจจุบัน</p>
          <h1>ฟรี</h1>
          <p className="muted">ใช้ได้ทุกอย่างที่เปิดในเวอร์ชันทดลองนี้ รวมถึงการตั้งเวลาหน้าจอ</p>
          <hr className="sep" />
          <h2>{plus.name.th}</h2>
          <p className="muted">฿{fmt(plus.price_minor_units.month)}/เดือน หรือ ฿{fmt(plus.price_minor_units.year)}/ปี — {PLAN_CATALOG.status_label.th}</p>
          <ul className="plain-list">{plus.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <button className="btn btn--block" disabled aria-describedby="bill-note">ชำระเงิน (ยังไม่เปิด)</button>
          <p id="bill-note" className="muted small">
            {!online ? "ต้องเชื่อมต่ออินเทอร์เน็ตเพื่อชำระเงิน • " : ""}
            ระบบชำระเงินจะเปิดเมื่อผ่านการทดสอบ sandbox และการตรวจทางกฎหมาย/บัญชี เมื่อเปิดแล้วยกเลิกเองได้ที่หน้านี้
          </p>
        </article>
      </main>
    </ParentGate>
  );
}
