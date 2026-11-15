"use client";
import Link from "next/link";
import { useState } from "react";
import { speak } from "@/lib/audio";
import { Toy } from "@/components/brand/Toys";
import type { ColorId } from "@growlilo/game-core";

const WORDS: Array<{ id: ColorId; en: string; say: string; th: string }> = [
  { id: "red", en: "red", say: "เร็ด", th: "สีแดง" },
  { id: "blue", en: "blue", say: "บลู", th: "สีน้ำเงิน" },
  { id: "yellow", en: "yellow", say: "เยลโล่ว", th: "สีเหลือง" },
  { id: "green", en: "green", say: "กรีน", th: "สีเขียว" },
];

export function EnglishSpotlight() {
  const [i, setI] = useState(0);
  const w = WORDS[i];
  return (
    <div className="spot__demo">
      <div className="wordcard">
        <div className="wordcard__art"><Toy kind="ball" color={w.id} size={120} /></div>
        <div className="wordcard__body">
          <p className="wordcard__en" lang="en">{w.en}</p>
          <p className="wordcard__say">อ่านว่า “{w.say}” • {w.th}</p>
          <button className="btn btn--peach btn--sm" onClick={() => speak(w.en)} aria-label={`ฟังเสียงคำว่า ${w.en}`}>
            <SpeakerIcon /> ฟังเสียง
          </button>
        </div>
      </div>
      <div className="wordcard__tabs" role="tablist" aria-label="เลือกคำ">
        {WORDS.map((x, k) => (
          <button key={x.id} role="tab" aria-selected={k === i} className={k === i ? "is-on" : ""} onClick={() => setI(k)} lang="en">
            <span className="swatch" style={{ background: `var(--toy-${x.id})` }} />{x.en}
          </button>
        ))}
      </div>
      <div className="phrase">
        <p className="phrase__label">ประโยคชวนลูกพูด</p>
        <p lang="en" className="phrase__en">“Can you find something {w.en}?”</p>
        <p className="phrase__th">หาของ{w.th}เจอไหม? • อ่านว่า แคน ยู ไฟนด์ ซัมติง {w.say}</p>
      </div>
      <p className="spot__fine">เสียงในเวอร์ชันทดลองใช้เสียงสังเคราะห์ของอุปกรณ์ — จะแทนด้วยเสียงเจ้าของภาษาที่ผ่านการตรวจโดยครู</p>
      <Link className="btn" href="/app/welcome/">เล่นภาษาอังกฤษฟรี <span className="arrow" aria-hidden>→</span></Link>
    </div>
  );
}

export function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}
