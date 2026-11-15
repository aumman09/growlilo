"use client";
import Link from "next/link";
import { useState } from "react";
import { confirmMission, REFLECTION_CHIPS } from "@growlilo/game-core";
import { getMission, SUBJECT_TH } from "@/lib/content";
import { newId, useActiveProfile } from "@/lib/store";
import { speak } from "@/lib/audio";
import { ParentGate } from "./ParentGate";
import { RequireProfile } from "./RequireProfile";
import { SpeakerIcon } from "@/components/marketing/EnglishSpotlight";

export function MissionParentView({ missionId }: { missionId: string }) {
  return (
    <ParentGate reason="ยืนยันภารกิจของลูก">
      <RequireProfile>{() => <View missionId={missionId} />}</RequireProfile>
    </ParentGate>
  );
}

function View({ missionId }: { missionId: string }) {
  const m = getMission(missionId)!;
  const { profile, update, state } = useActiveProfile();
  const [reflection, setReflection] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const already = state.missionCompletions.filter((c) => c.profileId === profile!.id && c.missionId === m.id).length;

  const confirm = () => {
    const id = newId();
    update((s) => confirmMission(s, { id, profileId: profile!.id, mission: m, reflection, at: new Date().toISOString() }));
    setDoneId(id);
  };

  if (doneId) {
    return (
      <main className="screen screen--parent">
        <section className="pcard pcard--center" data-testid="mission-confirmed">
          <div className="okmark" aria-hidden>✓</div>
          <h1>บันทึกแล้ว ขอบคุณที่เล่นด้วยกัน</h1>
          <p className="muted">ภารกิจ “{m.title.th}” ถูกเพิ่มในเส้นทางการเติบโตของ {profile!.nickname || "ลูก"}</p>
          <Link className="btn btn--lg" href="/app/parent/" data-testid="to-dashboard">ดูความคืบหน้า</Link>
          <Link className="done__home" href="/app/home/">กลับโหมดเด็ก</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="screen screen--parent">
      <nav className="pnav-top"><Link href="/app/parent/">← แดชบอร์ด</Link><Link href="/app/home/">โหมดเด็ก</Link></nav>
      <article className="pcard mission">
        <p className="eyebrow-s">{SUBJECT_TH[m.subject]} • {m.duration_minutes} นาที • เตรียมของ {m.max_prep_minutes === 0 ? "ไม่ต้องเตรียม" : `${m.max_prep_minutes} นาที`}</p>
        <h1>{m.title.th} <span lang="en" className="muted">({m.title.en})</span></h1>
        <p className="mission__child"><b>ลูกเห็นว่า:</b> {m.child_instruction.th}</p>
        {m.materials.length > 0 && <p><b>อุปกรณ์:</b> {m.materials.join(", ")}</p>}

        <h2>ขั้นตอนสำหรับพ่อแม่</h2>
        <ol className="steps-p">{m.adult_steps.map((s) => <li key={s}>{s}</li>)}</ol>

        {m.phrases.length > 0 && (
          <>
            <h2>ประโยคภาษาอังกฤษที่ใช้ได้เลย</h2>
            <ul className="phrases">
              {m.phrases.map((p) => (
                <li key={p.en}>
                  <button className="iconbtn iconbtn--sm" onClick={() => speak(p.en)} aria-label={`ฟังเสียง ${p.en}`}><SpeakerIcon /></button>
                  <div><p lang="en" className="phrases__en">{p.en}</p><p className="muted">{p.th} • อ่านว่า {p.say_th}</p></div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="safety" role="note">
          <h2>ข้อควรระวัง</h2>
          <ul>{m.safety_notes.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>

        {m.variations.length > 0 && (<><h2>อยากเล่นต่อ</h2><ul className="plain-list">{m.variations.map((v) => <li key={v}>{v}</li>)}</ul></>)}

        <h2>{m.completion_question} <span className="muted">(ไม่บังคับ)</span></h2>
        <div className="pill-row" role="radiogroup" aria-label="ความรู้สึกหลังเล่น">
          {REFLECTION_CHIPS.map((c) => (
            <button key={c} role="radio" aria-checked={reflection === c} className={`pill ${reflection === c ? "is-on" : ""}`} onClick={() => setReflection(reflection === c ? null : c)}>{c}</button>
          ))}
        </div>

        {already > 0 && <p className="muted">ยืนยันภารกิจนี้ไปแล้ว {already} ครั้ง — ทำซ้ำได้เสมอ</p>}
        <button className="btn btn--lg btn--block" onClick={confirm} data-testid="confirm-mission">ทำภารกิจเสร็จแล้ว — ยืนยัน</button>
        <Link className="done__home" href="/app/home/">ยังไม่ได้ทำ เก็บไว้ทีหลัง</Link>
      </article>
    </main>
  );
}
