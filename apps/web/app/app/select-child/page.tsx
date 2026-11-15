"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { selectProfile } from "@growlilo/game-core";
import { useProgress, useReady } from "@/lib/store";
import { AvatarIcon } from "@/components/brand/Toys";

export default function SelectChild() {
  const ready = useReady();
  const { state, update } = useProgress();
  const router = useRouter();
  return (
    <main className="screen screen--child">
      <div className="select">
        <h1>ใครจะเล่นวันนี้?</h1>
        <div className="select__grid">
          {ready && state.profiles.map((p) => (
            <button key={p.id} className="select__tile" onClick={() => { update((s) => selectProfile(s, p.id)); router.push("/app/home/"); }} data-testid="profile-tile">
              <AvatarIcon id={p.avatarId} size={96} />
              <b>{p.nickname || "นักสำรวจ"}</b>
              <span>{p.ageBand.replace("-", "–")} ปี</span>
            </button>
          ))}
        </div>
        {ready && state.profiles.length === 0 && <p>ยังไม่มีโปรไฟล์</p>}
        <Link className="btn btn--ghost" href="/app/welcome/">+ เพิ่มโปรไฟล์ (ผู้ปกครอง)</Link>
      </div>
    </main>
  );
}
