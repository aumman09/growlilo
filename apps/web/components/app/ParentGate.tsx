"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { checkGate, createGateChallenge, type GateChallenge } from "@growlilo/game-core";
import { isGateUnlocked, unlockGate } from "@/lib/gate";
import { LogoMark } from "@/components/brand/Mascots";

/**
 * Parent gate — a usability barrier before adult-only areas (PRD §2).
 * Not identity verification; real parent auth arrives in Phase 3.
 */
export function ParentGate({ children, reason = "โซนผู้ปกครอง" }: { children: React.ReactNode; reason?: string }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [challenge, setChallenge] = useState<GateChallenge | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ok = isGateUnlocked();
    setUnlocked(ok);
    if (!ok) setChallenge(createGateChallenge(Math.floor(Math.random() * 1e9)));
  }, []);
  useEffect(() => { if (unlocked === false) inputRef.current?.focus(); }, [unlocked, challenge]);

  if (unlocked === null) return <div className="gate gate--loading" aria-busy="true" />;
  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;
    if (checkGate(challenge, value)) {
      unlockGate();
      setUnlocked(true);
      return;
    }
    const t = tries + 1;
    setTries(t);
    setValue("");
    setError("คำตอบยังไม่ถูก ลองข้อใหม่อีกครั้ง");
    setChallenge(createGateChallenge(Math.floor(Math.random() * 1e9)));
  };

  return (
    <main className="gate">
      <div className="gate__card">
        <LogoMark size={44} />
        <p className="gate__eyebrow">{reason}</p>
        <h1>สำหรับผู้ใหญ่เท่านั้น</h1>
        <p className="gate__help">ตอบคำถามนี้เพื่อเข้าสู่โซนผู้ปกครอง (ตอบเป็นตัวเลข)</p>
        <form onSubmit={submit} className="gate__form">
          <label htmlFor="gate-answer" className="gate__q" data-testid="gate-question">{challenge?.question}</label>
          <input
            id="gate-answer" ref={inputRef} inputMode="numeric" pattern="[0-9]*" autoComplete="off"
            value={value} onChange={(e) => { setValue(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)); setError(""); }}
            aria-invalid={!!error} aria-describedby={error ? "gate-err" : undefined} className="field"
          />
          {error && <p id="gate-err" className="field-error" role="alert">{error}</p>}
          <button className="btn btn--block btn--lg" type="submit" disabled={!value}>ยืนยัน</button>
        </form>
        <Link className="gate__back" href="/app/home/">← กลับไปหน้าของลูก</Link>
      </div>
    </main>
  );
}
