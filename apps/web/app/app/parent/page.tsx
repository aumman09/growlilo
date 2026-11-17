"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  deleteProfile, exportProfile, FAMILY_TIMES, generatePlan, labelForAttempt, recommendNext, SCREEN_CAP_MAX, SCREEN_CAP_MIN,
  selectProfile, updateSettings, weeklySummary, type ChildProfile, type FamilyTime,
} from "@growlilo/game-core";
import { ParentGate } from "@/components/app/ParentGate";
import { RequireProfile } from "@/components/app/RequireProfile";
import { AvatarIcon } from "@/components/brand/Toys";
import { LESSONS, MISSIONS, PROMPTS, SKILL_NAMES, SUBJECT_TH, getLesson, getMission } from "@/lib/content";
import { useActiveProfile } from "@/lib/store";
import { lockGate } from "@/lib/gate";
import { useRouter } from "next/navigation";

export default function ParentDashboard() {
  return (
    <ParentGate>
      <RequireProfile>{(p) => <Dashboard profile={p} />}</RequireProfile>
    </ParentGate>
  );
}

const fmtDate = (iso: string) => new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

function Dashboard({ profile }: { profile: ChildProfile }) {
  const router = useRouter();
  const { state, update } = useActiveProfile();
  const now = useMemo(() => new Date(), []);
  const week = weeklySummary(state, profile.id, now);
  const rec = recommendNext(state, profile.id, LESSONS, MISSIONS);
  const plan = generatePlan(
    { ageBand: profile.ageBand, totalMinutes: profile.settings.familyMinutes, topic: "english", place: "indoor", screenCapMinutes: profile.settings.screenCapMinutes,
      recentMissionIds: state.missionCompletions.filter((m) => m.profileId === profile.id).slice(-3).map((m) => m.missionId) },
    LESSONS, MISSIONS, PROMPTS,
  );
  const history = [
    ...state.attempts.filter((a) => a.profileId === profile.id).map((a) => ({ at: a.finishedAt, kind: "lesson" as const, title: getLesson(a.lessonId)?.title.th ?? a.lessonId, detail: `${a.itemsCompleted}/${a.totalItems} ข้อ • ${labelForAttempt(a)}${a.endedBy === "screen_cap" ? " • จบเพราะครบเวลาจอ" : ""}` })),
    ...state.missionCompletions.filter((m) => m.profileId === profile.id).map((m) => ({ at: m.confirmedByParentAt, kind: "mission" as const, title: getMission(m.missionId)?.title.th ?? m.missionId, detail: m.reflection ? `สนุกกับ: ${m.reflection}` : "ยืนยันโดยผู้ปกครอง" })),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);

  const [cap, setCap] = useState(profile.settings.screenCapMinutes);
  const [family, setFamily] = useState<FamilyTime>(profile.settings.familyMinutes);
  const [savedMsg, setSavedMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const saveSettings = () => {
    update((s) => updateSettings(s, profile.id, { screenCapMinutes: cap, familyMinutes: family }, new Date().toISOString()));
    setSavedMsg("บันทึกแล้ว — แผนวันนี้อัปเดตตามเวลาใหม่");
  };
  const toggle = (k: "soundOn" | "reducedMotion") => update((s) => updateSettings(s, profile.id, { [k]: !profile.settings[k] }, new Date().toISOString()));

  const doExport = () => {
    const blob = new Blob([JSON.stringify(exportProfile(state, profile.id), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `growlilo-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const doDelete = () => {
    const remaining = state.profiles.length - 1;
    update((s) => deleteProfile(s, profile.id));
    router.replace(remaining > 0 ? "/app/select-child/" : "/app/welcome/");
  };

  return (
    <main className="screen screen--parent dash">
      <header className="dash__top">
        <div>
          <p className="eyebrow-s">โซนผู้ปกครอง</p>
          <h1>ภาพรวมครอบครัว</h1>
        </div>
        <div className="dash__actions">
          <Link className="btn btn--sm btn--peach" href="/app/home/" data-testid="child-mode">โหมดเด็ก</Link>
          <button className="btn btn--sm btn--ghost" onClick={() => { lockGate(); router.push("/app/home/"); }}>ล็อก</button>
        </div>
      </header>

      <div className="kids" role="tablist" aria-label="เลือกโปรไฟล์ลูก">
        {state.profiles.map((p) => (
          <button key={p.id} role="tab" aria-selected={p.id === profile.id} className={`kid ${p.id === profile.id ? "is-on" : ""}`} onClick={() => update((s) => selectProfile(s, p.id))}>
            <AvatarIcon id={p.avatarId} size={36} /><span>{p.nickname || "นักสำรวจ"}</span><small>{p.ageBand.replace("-", "–")} ปี</small>
          </button>
        ))}
        <Link className="kid kid--add" href="/app/welcome/">+ เพิ่ม</Link>
      </div>

      <section id="overview" className="dash__grid">
        <article className="pcard plan-card" aria-labelledby="plan-h">
          <div className="pcard__head"><h2 id="plan-h">แผนครอบครัววันนี้</h2><span className="chip chip--leaf">{profile.settings.familyMinutes} นาที</span></div>
          {plan.kind !== "roadmap" && (
            <ol className="tl tl--compact" data-testid="dash-plan">
              {plan.segments.map((s, i) => (
                <li key={i} className={s.type === "screen" ? "tl--screen" : s.type === "mission" ? "tl--mission" : "tl--talk"}>
                  <span className="tl__min">{s.minutes}<small>นาที</small></span>
                  <div><b>{s.type === "screen" ? "เกมบนจอ" : s.type === "mission" ? "ภารกิจนอกจอ" : "คุยกัน"}</b><p>{s.type === "talk" ? s.prompt : s.title}</p></div>
                </li>
              ))}
            </ol>
          )}
          <p className="muted small">แผนจัดตามกฎที่กำหนดไว้ ไม่ใช่ AI • ทำหรือไม่ทำก็ได้ ไม่มีการนับวันต่อเนื่อง</p>
        </article>

        <article className="pcard" aria-labelledby="week-h">
          <h2 id="week-h">7 วันที่ผ่านมา</h2>
          <div className="stats">
            <div><b data-testid="stat-lessons">{week.lessonsAttempted}</b><span>เกมที่เล่น</span></div>
            <div><b data-testid="stat-missions">{week.missionsConfirmed}</b><span>ภารกิจด้วยกัน</span></div>
            <div><b>{week.minutesOnScreenApprox === 0 && week.lessonsAttempted > 0 ? "<1" : week.minutesOnScreenApprox}</b><span>นาทีบนจอ (ประมาณ)</span></div>
          </div>
          {week.lessonsAttempted + week.missionsConfirmed === 0 ? (
            <p className="empty">ยังไม่มีกิจกรรม — เริ่มจากเกมสั้น ๆ แล้วต่อด้วยภารกิจนอกจอได้เลย</p>
          ) : (
            <ul className="subj">
              {Object.entries(week.subjects).filter(([, n]) => n > 0).map(([k, n]) => <li key={k}><span>{SUBJECT_TH[k]}</span><b>{n}</b></li>)}
            </ul>
          )}
        </article>

        <article className="pcard next-card" aria-labelledby="next-h" data-testid="try-next">
          <h2 id="next-h">ลองต่อ</h2>
          <p className="next-card__title">{rec.title}</p>
          <p className="muted">{rec.reason}</p>
          <Link className="btn btn--sm" href={rec.kind === "lesson" ? `/app/lesson/${rec.targetId}/` : `/app/mission/${rec.targetId}/`}>
            {rec.kind === "lesson" ? "เปิดเกมให้ลูก" : "ดูภารกิจ"}
          </Link>
        </article>

        <Link href="/app/library/" className="pcard lib-entry" data-testid="library-entry">
          <span aria-hidden><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#357553" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h7M8 11h5" /></svg></span>
          <span><b>ห้องสมุดครอบครัว (วัย 1–3 ปี)</b><span className="muted small">ใบงานพิมพ์ได้ + นิทานไทย/อังกฤษ พร้อมเสียงอ่าน</span></span>
        </Link>

        <article className="pcard" aria-labelledby="skills-h">
          <h2 id="skills-h">ทักษะที่ได้ฝึก</h2>
          {week.skills.length === 0 ? <p className="empty">จะแสดงหลังลูกเล่นเกมแรก</p> : (
            <ul className="skills">
              {week.skills.map((s) => (
                <li key={s.skillId}><span>{SKILL_NAMES[s.skillId] ?? s.skillId}</span><span className={`chip ${s.label === "ทำได้ในกิจกรรมนี้" ? "chip--leaf" : s.label === "กำลังฝึก" ? "chip--blue" : "chip--peach"}`}>{s.label}</span></li>
              ))}
            </ul>
          )}
          <p className="muted small">ผลมาจากกิจกรรมในแอปเท่านั้น ไม่ใช่การประเมินพัฒนาการหรือระดับสติปัญญา</p>
        </article>

        <article className="pcard dash__wide" aria-labelledby="hist-h">
          <h2 id="hist-h">กิจกรรมล่าสุด</h2>
          {history.length === 0 ? <p className="empty">ยังไม่มีประวัติ</p> : (
            <ul className="hist">
              {history.map((h, i) => (
                <li key={i}><span className={`hist__dot hist__dot--${h.kind}`} aria-hidden /><div><b>{h.title}</b><p className="muted">{h.detail}</p></div><time>{fmtDate(h.at)}</time></li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section id="settings" className="pcard dash__settings" aria-labelledby="set-h">
        <h2 id="set-h">ตั้งค่าเวลา (ใช้ได้ทุกแพ็ก)</h2>
        <label className="field-label" htmlFor="cap-p">เวลาหน้าจอต่อรอบ: <b>{cap} นาที</b></label>
        <input id="cap-p" type="range" className="range" min={SCREEN_CAP_MIN} max={SCREEN_CAP_MAX} value={cap} onChange={(e) => { setCap(Number(e.target.value)); setSavedMsg(""); }} aria-valuetext={`${cap} นาที`} data-testid="cap-slider" />
        <fieldset className="plain">
          <legend className="field-label">เวลาเล่นด้วยกันทั้งหมด</legend>
          <div className="pill-row">
            {FAMILY_TIMES.map((t) => (
              <label key={t} className={`pill ${family === t ? "is-on" : ""}`}><input type="radio" name="fam" checked={family === t} onChange={() => { setFamily(t); setSavedMsg(""); }} />{t} นาที</label>
            ))}
          </div>
        </fieldset>
        <button className="btn" onClick={saveSettings} data-testid="save-settings">บันทึกการตั้งค่า</button>
        {savedMsg && <p className="ok-msg" role="status">{savedMsg}</p>}
        <div className="toggles">
          <label className="switch"><input type="checkbox" checked={profile.settings.soundOn} onChange={() => toggle("soundOn")} /><span>เสียงในเกม</span></label>
          <label className="switch"><input type="checkbox" checked={profile.settings.reducedMotion} onChange={() => toggle("reducedMotion")} /><span>ลดการเคลื่อนไหว</span></label>
        </div>
      </section>

      <section id="privacy" className="pcard dash__settings" aria-labelledby="priv-h">
        <h2 id="priv-h">ข้อมูลและความเป็นส่วนตัว</h2>
        <p className="muted">ข้อมูลทั้งหมดอยู่ในเบราว์เซอร์ของเครื่องนี้ ยังไม่มีการซิงก์ขึ้นคลาวด์ เบราว์เซอร์อาจลบข้อมูลเมื่อพื้นที่เต็มหรือเมื่อคุณล้างประวัติ</p>
        <div className="row-btns">
          <button className="btn btn--ghost" onClick={doExport}>ส่งออกข้อมูลของ {profile.nickname || "ลูก"} (JSON)</button>
          {!confirmDelete ? (
            <button className="btn btn--ghost btn--danger" onClick={() => setConfirmDelete(true)}>ลบโปรไฟล์นี้</button>
          ) : (
            <div className="confirm" role="alertdialog" aria-labelledby="del-q">
              <p id="del-q">ลบโปรไฟล์และผลกิจกรรมทั้งหมดของ {profile.nickname || "ลูก"}? ย้อนกลับไม่ได้</p>
              <button className="btn btn--danger-solid" onClick={doDelete}>ลบถาวร</button>
              <button className="btn btn--ghost" onClick={() => setConfirmDelete(false)}>ยกเลิก</button>
            </div>
          )}
        </div>
      </section>

      <section className="pcard dash__settings" aria-labelledby="bill-h">
        <h2 id="bill-h">แพ็กของครอบครัว</h2>
        <p className="muted">ตอนนี้ใช้แพ็กฟรี • Family Plus ยังไม่เปิดชำระเงิน</p>
        <Link className="btn btn--ghost" href="/app/parent/billing/">ดูรายละเอียดแพ็ก</Link>
      </section>

      <nav className="pbar" aria-label="เมนูผู้ปกครอง">
        <a href="#overview">ภาพรวม</a><a href="#settings">เวลา</a><a href="#privacy">ข้อมูล</a><Link href="/app/parent/billing/">แพ็ก</Link>
      </nav>
    </main>
  );
}
