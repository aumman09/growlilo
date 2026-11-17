"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addProfile, giveConsent, FAMILY_TIMES, MAX_LOCAL_PROFILES, SCREEN_CAP_MAX, SCREEN_CAP_MIN,
  type AgeBand, type FamilyTime,
} from "@growlilo/game-core";
import { newId, useProgress, useReady } from "@/lib/store";
import { AVATARS } from "@/lib/content";
import { AvatarIcon } from "@/components/brand/Toys";
import { Grow, Lilo, LogoMark } from "@/components/brand/Mascots";

const AGE_OPTIONS: Array<{ v: AgeBand; label: string; note: string; enabled: boolean }> = [
  { v: "4-5", label: "4–5 ปี", note: "ฟัง ดูภาพ แตะตอบ", enabled: true },
  { v: "6-8", label: "6–8 ปี", note: "คำศัพท์ ประโยคสั้น", enabled: true },
  { v: "2-3", label: "2–3 ปี", note: "ยังไม่เปิดโหมดเกม — ใช้ห้องสมุดใบงานและนิทานแทน", enabled: false },
  { v: "9-12", label: "9–12 ปี", note: "อยู่ในแผนพัฒนา", enabled: false },
];

export default function Welcome() {
  const ready = useReady();
  const router = useRouter();
  const { state, update } = useProgress();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [age, setAge] = useState<AgeBand | null>(null);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0].id);
  const [family, setFamily] = useState<FamilyTime>(15);
  const [cap, setCap] = useState(5);
  const [error, setError] = useState("");

  // Returning parent who already consented skips the intro step.
  useEffect(() => { if (ready && state.consentAt && step === 0) setStep(1); }, [ready, state.consentAt, step]);

  const atLimit = state.profiles.length >= MAX_LOCAL_PROFILES;
  const total = 4;

  const finish = () => {
    try {
      update((s) => {
        const base = s.consentAt ? s : giveConsent(s, new Date().toISOString());
        return addProfile(base, { id: newId(), nickname, ageBand: age!, avatarId: avatar, settings: { familyMinutes: family, screenCapMinutes: cap } }, new Date().toISOString());
      });
      setStep(4);
    } catch (e) {
      setError(e instanceof Error && e.message.includes("limit") ? "เพิ่มโปรไฟล์ได้สูงสุด 4 คนในเครื่องนี้" : "บันทึกไม่สำเร็จ ลองอีกครั้ง");
    }
  };

  if (!ready || (state.consentAt && step === 0)) return <main className="onb" aria-busy="true" />;

  return (
    <main className="onb">
      <header className="onb__top">
        <Link href="/" className="onb__brand" aria-label="กลับหน้าเว็บไซต์"><LogoMark size={36} /><span>growlilo<span className="dot">.</span></span></Link>
        {step > 0 && step < 4 && <span className="onb__step" aria-live="polite">ขั้นที่ {step}/{total - 1}</span>}
      </header>

      {step < 4 && (
        <div className="onb__progress" aria-hidden><span style={{ width: `${(step / (total - 1)) * 100}%` }} /></div>
      )}

      {step === 0 && (
        <section className="onb__card" aria-labelledby="w0">
          <div className="onb__art"><Grow size={96} /><Lilo size={84} wave /></div>
          <p className="onb__eyebrow">สำหรับผู้ปกครอง • ใช้เวลา 1 นาที</p>
          <h1 id="w0">ตั้งค่าก่อนส่งเครื่องให้ลูก</h1>
          <ul className="onb__list">
            <li><b>Growlilo ทำงานอย่างไร</b> — เกมสั้น 3–5 นาที → พักจอ → ภารกิจทำด้วยกันนอกจอ → คุณกดยืนยัน</li>
            <li><b>เก็บข้อมูลน้อยที่สุด</b> — ถามแค่ช่วงอายุ ชื่อเล่น (ไม่บังคับ) และอวตาร ไม่ขอชื่อจริง วันเกิด รูป ไมค์ หรือตำแหน่ง</li>
            <li><b>เก็บไว้ในเครื่องนี้เท่านั้น</b> — ยังไม่ต้องสมัครบัญชี ลบหรือส่งออกข้อมูลได้เองในโซนผู้ปกครอง</li>
          </ul>
          <label className="check">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} data-testid="consent" />
            <span>ฉันเป็นผู้ปกครอง/ผู้ดูแลของเด็ก และยอมรับ<Link href="/privacy/">นโยบายความเป็นส่วนตัว</Link> (ฉบับทดลอง)</span>
          </label>
          <button className="btn btn--block btn--lg" disabled={!consent} onClick={() => { update((s) => giveConsent(s, new Date().toISOString())); setStep(1); }}>
            เริ่มตั้งค่า
          </button>
          {ready && state.profiles.length > 0 && <Link className="onb__alt" href="/app/select-child/">มีโปรไฟล์อยู่แล้ว → เลือกโปรไฟล์</Link>}
        </section>
      )}

      {step === 1 && (
        <section className="onb__card" aria-labelledby="w1">
          <h1 id="w1">ลูกอายุเท่าไร?</h1>
          <p className="onb__sub">เลือกเป็นช่วงอายุ ไม่ต้องใส่วันเกิด</p>
          {atLimit && <p className="field-error" role="alert">เครื่องนี้มีโปรไฟล์ครบ {MAX_LOCAL_PROFILES} คนแล้ว ลบโปรไฟล์เดิมในโซนผู้ปกครองก่อน</p>}
          <div className="opt-grid" role="radiogroup" aria-label="ช่วงอายุ">
            {AGE_OPTIONS.map((o) => (
              <button key={o.v} role="radio" aria-checked={age === o.v} disabled={!o.enabled} className={`opt ${age === o.v ? "is-on" : ""}`} onClick={() => setAge(o.v)}>
                <b>{o.label}</b><span>{o.note}</span>
              </button>
            ))}
          </div>
          <p className="hint">ลูกอายุ 1–3 ปี? <Link href="/app/library/">ไปห้องสมุดใบงานพิมพ์ได้และนิทานสองภาษา</Link> — ไม่ต้องสร้างโปรไฟล์</p>
          <div className="onb__nav">
            <span />
            <button className="btn btn--lg" disabled={!age || atLimit} onClick={() => setStep(2)}>ถัดไป</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="onb__card" aria-labelledby="w2">
          <h1 id="w2">เลือกอวตารของลูก</h1>
          <p className="onb__sub">ชื่อเล่นไม่บังคับ — ใช้ชื่อเล่นหรือคำที่ลูกชอบแทนชื่อจริงได้</p>
          <div className="avatar-grid" role="radiogroup" aria-label="อวตาร">
            {AVATARS.map((a) => (
              <button key={a.id} role="radio" aria-checked={avatar === a.id} aria-label={a.label} className={`avatar ${avatar === a.id ? "is-on" : ""}`} onClick={() => setAvatar(a.id)}>
                <AvatarIcon id={a.id} size={64} />
                <span>{a.label}</span>
              </button>
            ))}
          </div>
          <label className="field-label" htmlFor="nick">ชื่อเล่น (ไม่บังคับ)</label>
          <input id="nick" className="field" maxLength={20} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="เช่น ต้นกล้า" autoComplete="off" />
          <div className="onb__nav">
            <button className="btn btn--ghost" onClick={() => setStep(1)}>ย้อนกลับ</button>
            <button className="btn btn--lg" onClick={() => setStep(3)}>ถัดไป</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="onb__card" aria-labelledby="w3">
          <h1 id="w3">เวลาเล่นด้วยกัน</h1>
          <p className="onb__sub">เวลาทั้งหมดรวมกิจกรรมนอกจอ — ไม่ใช่เวลาหน้าจอทั้งหมด</p>
          <fieldset className="plain">
            <legend className="field-label">มีเวลาเล่นด้วยกันประมาณ</legend>
            <div className="pill-row">
              {FAMILY_TIMES.map((t) => (
                <label key={t} className={`pill ${family === t ? "is-on" : ""}`}>
                  <input type="radio" name="family" checked={family === t} onChange={() => setFamily(t)} />{t} นาที
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field-label" htmlFor="cap">เวลาหน้าจอต่อรอบ: <b data-testid="cap-value">{cap} นาที</b></label>
          <input id="cap" type="range" min={SCREEN_CAP_MIN} max={SCREEN_CAP_MAX} step={1} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="range" aria-valuetext={`${cap} นาที`} />
          <p className="hint">เมื่อครบเวลา เกมจะให้ลูกตอบข้อที่ทำอยู่ให้จบ แล้วพาไปพักสายตา ไม่มีด่านต่ออัตโนมัติ (แนะนำ 5 นาทีสำหรับ 4–8 ปี)</p>
          <div className="mini-plan">
            <span style={{ flexGrow: Math.min(cap, Math.round(family / 3)) }} className="tlc tlc--screen">จอ</span>
            <span style={{ flexGrow: family - Math.min(cap, Math.round(family / 3)) }} className="tlc tlc--off">นอกจอ + คุยกัน</span>
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <div className="onb__nav">
            <button className="btn btn--ghost" onClick={() => setStep(2)}>ย้อนกลับ</button>
            <button className="btn btn--lg" onClick={finish}>สร้างโปรไฟล์</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="onb__card onb__card--done" aria-labelledby="w4">
          <Lilo size={120} expr="wow" wave />
          <h1 id="w4">พร้อมแล้ว!</h1>
          <p className="onb__sub">ส่งเครื่องให้ลูกได้เลย — โหมดเด็กไม่มีโฆษณา การซื้อ หรือลิงก์ออกนอกแอป<br />กลับมาโซนผู้ปกครองได้จากไอคอนแม่กุญแจมุมขวาบน</p>
          <button className="btn btn--block btn--lg btn--peach" onClick={() => router.push("/app/home/")}>ส่งเครื่องให้ลูก เริ่มเล่น</button>
        </section>
      )}
    </main>
  );
}
