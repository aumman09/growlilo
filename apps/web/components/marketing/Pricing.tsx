"use client";
import Link from "next/link";
import { useState } from "react";
import { PLAN_CATALOG } from "@/lib/content";

const fmt = (minor: number) => new Intl.NumberFormat("th-TH").format(minor / 100);

export function Pricing() {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const c = PLAN_CATALOG;
  return (
    <>
      <div className="pricing__switch" role="radiogroup" aria-label="รอบการชำระ">
        {(["month", "year"] as const).map((v) => (
          <button key={v} role="radio" aria-checked={interval === v} className={interval === v ? "is-on" : ""} onClick={() => setInterval(v)}>
            {v === "month" ? "รายเดือน" : "รายปี"}
          </button>
        ))}
      </div>
      <div className="pricing__grid">
        {c.plans.map((p) => {
          const price = p.price_minor_units[interval];
          const featured = p.sku !== "free";
          return (
            <article key={p.sku} className={`price ${featured ? "price--featured" : ""}`} data-testid={`plan-${p.sku}`}>
              <header>
                <h3>{p.name.th}</h3>
                {!p.available && <span className="chip chip--soon">วางแผนไว้ • ยังไม่เปิดขาย</span>}
              </header>
              <p className="price__tag">{p.tagline.th}</p>
              <p className="price__amount">
                {price === 0 ? <><b>ฟรี</b><span>ตลอดไป</span></> : <><b>฿{fmt(price)}</b><span>/{interval === "month" ? "เดือน" : "ปี"}</span></>}
              </p>
              <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              {p.available ? (
                <Link className="btn btn--block" href="/app/welcome/">เริ่มฟรี</Link>
              ) : (
                <>
                  <button className="btn btn--block btn--light" disabled={!c.checkout_enabled} aria-describedby="pricing-status">
                    เลือกแพ็ก (ยังไม่เปิดชำระเงิน)
                  </button>
                </>
              )}
            </article>
          );
        })}
      </div>
      <p id="pricing-status" className="pricing__status">{c.status_label.th}</p>
      <ul className="pricing__notes">{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
    </>
  );
}
