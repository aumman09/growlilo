"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { canAccess, hasFeature, isNew, visibleItems, type ToddlerBand } from "@growlilo/game-core";
import { ParentGate } from "@/components/app/ParentGate";
import { Picture } from "@/components/brand/Picture";
import { PlusDemoSwitch, TierChip } from "@/components/library/PlanBadge";
import { ALL_STORIES, ALL_WORKSHEETS, SKILL_TH, THEME_TH } from "@/lib/content";
import { useLibrary } from "@/lib/library-store";
import "@/styles/library-shared.css";
import { useReady } from "@/lib/store";

type Tab = "worksheets" | "stories";
type BandFilter = ToddlerBand | "all";

export default function LibraryPage() {
  return <ParentGate reason="ห้องสมุดครอบครัว"><Library /></ParentGate>;
}

function previewPicture(t: (typeof ALL_WORKSHEETS)[number]["template"]) {
  switch (t.kind) {
    case "trace": case "path": return t.from;
    case "match": return t.items[0];
    case "same": return t.target;
    default: return t.picture;
  }
}

function Library() {
  const ready = useReady();
  const { lib, plan } = useLibrary();
  const [tab, setTab] = useState<Tab>("worksheets");
  const [band, setBand] = useState<BandFilter>("all");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const now = useMemo(() => new Date(), []);

  const worksheets = visibleItems(ALL_WORKSHEETS, now).filter((w) => band === "all" || w.age_bands.includes(band)).filter((w) => !onlyOpen || canAccess(w, plan));
  const stories = visibleItems(ALL_STORIES, now).filter((s) => band === "all" || s.age_bands.includes(band)).filter((s) => !onlyOpen || canAccess(s, plan));
  const totalW = visibleItems(ALL_WORKSHEETS, now).length;
  const totalS = visibleItems(ALL_STORIES, now).length;

  // Show what the family can use first, newest first within each group.
  const byAccess = <T extends { access_tier: "free" | "plus" }>(xs: T[]) => [...xs].sort((a, b) => Number(canAccess(b, plan)) - Number(canAccess(a, plan)));
  if (!ready) return <main className="screen screen--parent" aria-busy="true" />;

  return (
    <main className="screen screen--parent lib">
      <nav className="pnav-top"><Link href="/app/parent/">← แดชบอร์ด</Link><Link href="/app/home/">โหมดเด็ก</Link></nav>
      <header className="lib__head">
        <p className="eyebrow-s">ห้องสมุดครอบครัว • วัย 1–3 ปี</p>
        <h1>ใบงานพิมพ์ได้ & นิทานสองภาษา</h1>
        <p className="muted">ออกแบบให้เล่น<b>นอกจอ</b>กับผู้ใหญ่: พิมพ์ใบงานไปทำบนโต๊ะ อ่านนิทานให้ลูกฟัง หรือเปิดเสียงแล้ววางเครื่องคว่ำไว้ (แนะนำให้เด็กต่ำกว่า 2 ปีไม่ใช้จอเอง)</p>
        <div className="lib__plan">
          <span className={`chip ${plan === "free" ? "chip--leaf" : "chip--blue"}`} data-testid="lib-plan">{plan === "free" ? "แพ็กฟรี" : "Family Plus (Demo)"}</span>
          <span className="muted small">ใบงาน {totalW} แผ่น • นิทาน {totalS} เรื่อง • มีเรื่องใหม่ทุกเดือน</span>
        </div>
      </header>

      <section className="lib__plus">
        <article className={`pcard plus-card ${hasFeature("weeklySet", plan) ? "" : "is-locked"}`}>
          <div><b>ชุดใบงานประจำสัปดาห์</b><p className="muted small">5 แผ่นคละทักษะ ตามวัยลูก พิมพ์ทีเดียวครบ</p></div>
          {hasFeature("weeklySet", plan)
            ? <Link className="btn btn--sm" href="/app/library/weekly/" data-testid="weekly-link">เปิดชุดสัปดาห์นี้</Link>
            : <span className="chip chip--blue">Plus</span>}
        </article>
        <article className={`pcard plus-card ${hasFeature("playlist", plan) ? "" : "is-locked"}`}>
          <div><b>เพลย์ลิสต์นิทานก่อนนอน</b><p className="muted small">เล่นนิทานที่กดหัวใจไว้ต่อกัน แล้วหยุดเอง ({lib.favorites.length} เรื่อง)</p></div>
          {hasFeature("playlist", plan)
            ? <Link className="btn btn--sm" href="/app/library/playlist/">เปิดเพลย์ลิสต์</Link>
            : <span className="chip chip--blue">Plus</span>}
        </article>
        <PlusDemoSwitch />
      </section>

      <div className="lib__tabs" role="tablist" aria-label="ประเภท">
        <button role="tab" aria-selected={tab === "worksheets"} className={tab === "worksheets" ? "is-on" : ""} onClick={() => setTab("worksheets")}>ใบงาน</button>
        <button role="tab" aria-selected={tab === "stories"} className={tab === "stories" ? "is-on" : ""} onClick={() => setTab("stories")}>นิทาน</button>
      </div>
      <div className="lib__filters">
        {(["all", "1-2", "2-3"] as BandFilter[]).map((b) => (
          <button key={b} className={`pill ${band === b ? "is-on" : ""}`} aria-pressed={band === b} onClick={() => setBand(b)}>{b === "all" ? "ทุกวัย" : `${b.replace("-", "–")} ปี`}</button>
        ))}
        <label className="switch small"><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} /><span>เฉพาะที่ใช้ได้</span></label>
      </div>

      {tab === "worksheets" ? (
        <ul className="lib__grid" data-testid="ws-grid">
          {byAccess(worksheets).map((w) => {
            const open = canAccess(w, plan);
            return (
              <li key={w.id}>
                <Link href={`/app/library/worksheet/${w.id}/`} className={`lcard ${open ? "" : "is-locked"}`} data-testid={`ws-${w.id}`}>
                  <span className="lcard__art"><Picture kind={previewPicture(w.template)} mode={w.template.kind === "color" ? "outline" : "fill"} size={84} /></span>
                  <TierChip tier={w.access_tier} isNew={isNew(w, now)} />
                  <b>{w.title.th}</b>
                  <span className="muted small">{SKILL_TH[w.skill] ?? w.skill} • {w.age_bands.map((b) => b.replace("-", "–")).join("/")} ปี • {w.minutes} นาที</span>
                  {lib.worksheetsDone[w.id] && <span className="lcard__done">ทำแล้ว</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="lib__grid" data-testid="story-grid">
          {byAccess(stories).map((s) => {
            const open = canAccess(s, plan);
            return (
              <li key={s.id}>
                <Link href={`/app/library/story/${s.id}/`} className={`lcard lcard--story ${open ? "" : "is-locked"}`} data-testid={`story-${s.id}`}>
                  <span className={`lcard__art scene--${s.pages[0].scene.bg}`}><Picture kind={s.pages.find((p) => p.scene.item)?.scene.item ?? "star"} size={72} /></span>
                  <TierChip tier={s.access_tier} isNew={isNew(s, now)} />
                  <b>{s.title.th}</b>
                  <span className="muted small" lang="en">{s.title.en}</span>
                  <span className="muted small">{THEME_TH[s.theme] ?? s.theme} • {s.pages.length} หน้า • ไทย/อังกฤษ</span>
                  {lib.favorites.includes(s.id) && <span className="lcard__done">♥</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="muted small lib__fine">เนื้อหาเป็นผลงานต้นฉบับของ Growlilo (ฉบับทดลอง อยู่ระหว่างให้ครูตรวจ) • เสียงอ่านใช้เสียงสังเคราะห์ของอุปกรณ์ชั่วคราว</p>
    </main>
  );
}
