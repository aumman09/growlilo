"use client";
import Link from "next/link";
import type { ChildProfile } from "@growlilo/game-core";
import { AvatarIcon } from "@/components/brand/Toys";

export function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/** Child header: avatar + discreet adult-zone lock (leads to parent gate). */
export function ChildTop({ profile }: { profile: ChildProfile }) {
  return (
    <header className="ctop">
      <Link href="/app/select-child/" className="ctop__me" aria-label="เปลี่ยนผู้เล่น">
        <AvatarIcon id={profile.avatarId} size={44} />
        <span>{profile.nickname || "นักสำรวจ"}</span>
      </Link>
      <Link href="/app/parent/" className="ctop__lock" aria-label="โซนผู้ปกครอง (สำหรับผู้ใหญ่)" data-testid="adult-lock">
        <LockIcon />
      </Link>
    </header>
  );
}
