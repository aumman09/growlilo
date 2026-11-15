"use client";
import Link from "next/link";
import { useState } from "react";
import { RequireProfile } from "@/components/app/RequireProfile";
import { ChildTop } from "@/components/app/ChildTop";
import { Lilo } from "@/components/brand/Mascots";
import { Toy } from "@/components/brand/Toys";
import { LESSONS } from "@/lib/content";

export default function ChildHome() {
  const [soon, setSoon] = useState<string | null>(null);
  return (
    <RequireProfile>
      {(profile) => {
        const lesson = LESSONS.find((l) => l.age_bands.includes(profile.ageBand)) ?? LESSONS[0];
        return (
          <main className="screen screen--child home">
            <ChildTop profile={profile} />
            <section className="home__greet">
              <Lilo size={120} wave className="anim-float" />
              <div className="bubble"><p>สวัสดี{profile.nickname ? ` ${profile.nickname}` : ""}!</p><p>วันนี้เราจะเล่นอะไรดี?</p></div>
            </section>

            <Link href={`/app/lesson/${lesson.id}/`} className="quest" data-testid="quest-card">
              <span className="quest__tag">ภารกิจวันนี้</span>
              <div className="quest__art" aria-hidden>
                <Toy kind="balloon" color="red" size={64} /><Toy kind="star" color="yellow" size={64} /><Toy kind="fish" color="blue" size={64} />
              </div>
              <div className="quest__body">
                <b>{lesson.title.th}</b>
                <span lang="en">{lesson.title.en}</span>
              </div>
              <span className="quest__play" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
              </span>
            </Link>

            <h2 className="home__h">โลกแห่งการเรียนรู้</h2>
            <div className="worlds-c">
              <Link href={`/app/lesson/${lesson.id}/`} className="wc wc--blue"><span className="wc__icon" lang="en">Aa</span><b>English</b></Link>
              <button className="wc wc--peach wc--soon" onClick={() => setSoon("ภาษาไทย")} aria-describedby="soon-note"><span className="wc__icon">กข</span><b>ภาษาไทย</b><small>กำลังปลูก</small></button>
              <button className="wc wc--leaf wc--soon" onClick={() => setSoon("คณิต")} aria-describedby="soon-note"><span className="wc__icon">123</span><b>คณิต</b><small>กำลังปลูก</small></button>
            </div>
            <p id="soon-note" className="home__soon" role="status">{soon ? `${soon} กำลังปลูกอยู่ เร็ว ๆ นี้นะ` : ""}</p>

            <Link href="/app/break/" className="together">
              <span className="together__ic" aria-hidden>♥</span>
              <span><b>เล่นกับพ่อแม่</b><small>ภารกิจนอกจอ</small></span>
            </Link>
          </main>
        );
      }}
    </RequireProfile>
  );
}
