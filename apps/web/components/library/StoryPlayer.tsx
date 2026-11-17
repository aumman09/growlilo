"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toggleFavorite, type Story } from "@growlilo/game-core";
import { Scene } from "./Scene";
import { speakAsync, stopSpeaking } from "@/lib/audio";
import { useLibrary } from "@/lib/library-store";
import { SpeakerIcon } from "@/components/marketing/EnglishSpotlight";

type Lang = "th" | "en" | "both";
const SLEEP_OPTIONS = [0, 5, 10, 15];

export function StoryPlayer({ story, autoStart = false, onFinished }: { story: Story; autoStart?: boolean; onFinished?: () => void }) {
  const { lib, update } = useLibrary();
  const [page, setPage] = useState(0);
  const [lang, setLang] = useState<Lang>("both");
  const [playing, setPlaying] = useState(false);
  const [listenOnly, setListenOnly] = useState(false);
  const [sleepMin, setSleepMin] = useState(0);
  const [sleepLeft, setSleepLeft] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const run = useRef(0);
  const cancelCur = useRef<() => void>(() => {});
  const fav = lib.favorites.includes(story.id);
  const last = story.pages.length - 1;

  const stop = useCallback(() => {
    run.current++;
    cancelCur.current();
    stopSpeaking();
    setPlaying(false);
    setListenOnly(false);
  }, []);

  const finish = useCallback(() => {
    setFinished(true);
    setPlaying(false);
    setListenOnly(false);
    update((s) => ({ ...s, storiesRead: { ...s.storiesRead, [story.id]: (s.storiesRead[story.id] ?? 0) + 1 } }));
    onFinished?.();
  }, [onFinished, story.id, update]);

  const play = useCallback(async (from: number) => {
    const token = ++run.current;
    setPlaying(true);
    setFinished(false);
    for (let i = from; i <= last; i++) {
      if (token !== run.current) return;
      setPage(i);
      const parts: Array<[string, "th-TH" | "en-US"]> = [];
      if (lang !== "en") parts.push([story.pages[i].th, "th-TH"]);
      if (lang !== "th") parts.push([story.pages[i].en, "en-US"]);
      for (const [text, l] of parts) {
        const s = speakAsync(text, l, l === "en-US" ? 0.85 : 0.95);
        cancelCur.current = s.cancel;
        try { await s.done; } catch { return; }
        if (token !== run.current) return;
        await new Promise((r) => setTimeout(r, 450));
      }
    }
    if (token === run.current) finish();
  }, [finish, lang, last, story.pages]);

  useEffect(() => {
    const r = run;
    if (autoStart) void play(0);
    return () => { r.current++; stopSpeaking(); };
    // Start once per story; `play` changes with language and must not restart playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id]);

  // Sleep timer — free for everyone (never paywall time limits).
  useEffect(() => {
    if (!sleepMin || !playing) { setSleepLeft(null); return; }
    const end = Date.now() + sleepMin * 60_000;
    setSleepLeft(sleepMin * 60);
    const t = window.setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      setSleepLeft(left);
      if (left === 0) stop();
    }, 1000);
    return () => window.clearInterval(t);
  }, [sleepMin, playing, stop]);

  const p = story.pages[page];
  const go = (i: number) => { stop(); setFinished(false); setPage(Math.max(0, Math.min(last, i))); };

  return (
    <div className="story" data-testid="story-player">
      <div className="story__bar">
        <div className="seg-mini" role="radiogroup" aria-label="ภาษา">
          {(["th", "en", "both"] as Lang[]).map((l) => (
            <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? "is-on" : ""} onClick={() => { stop(); setLang(l); }}>
              {l === "th" ? "ไทย" : l === "en" ? "English" : "สองภาษา"}
            </button>
          ))}
        </div>
        <button className={`iconbtn iconbtn--sm ${fav ? "is-fav" : ""}`} onClick={() => update((s) => toggleFavorite(s, story.id))} aria-pressed={fav} aria-label={fav ? "เอาออกจากเพลย์ลิสต์ก่อนนอน" : "เพิ่มในเพลย์ลิสต์ก่อนนอน"} data-testid="fav">
          {fav ? "♥" : "♡"}
        </button>
      </div>

      <Scene scene={p.scene} />

      <div className="story__text" aria-live="polite">
        {lang !== "en" && <p className="story__th" data-testid="page-th">{p.th}</p>}
        {lang !== "th" && <p className="story__en" lang="en" data-testid="page-en">{p.en}</p>}
      </div>

      <div className="story__nav">
        <button className="iconbtn" onClick={() => go(page - 1)} disabled={page === 0} aria-label="หน้าก่อน">‹</button>
        <span className="story__count">{page + 1} / {story.pages.length}</span>
        <button className="iconbtn" onClick={() => (page === last ? finish() : go(page + 1))} aria-label={page === last ? "จบเรื่อง" : "หน้าถัดไป"} data-testid="next-page">›</button>
      </div>

      <div className="story__audio">
        {playing ? (
          <button className="btn btn--peach" onClick={stop} data-testid="stop">หยุดเสียง</button>
        ) : (
          <button className="btn btn--peach" onClick={() => void play(page)} data-testid="play"><SpeakerIcon /> ฟังนิทาน</button>
        )}
        <button className="btn btn--ghost btn--sm" disabled={!playing} onClick={() => setListenOnly(true)} data-testid="listen-only">โหมดฟังอย่างเดียว</button>
        <label className="sleep">
          <span>ตั้งเวลาปิด</span>
          <select value={sleepMin} onChange={(e) => setSleepMin(Number(e.target.value))} aria-label="ตั้งเวลาปิดเสียง">
            {SLEEP_OPTIONS.map((m) => <option key={m} value={m}>{m === 0 ? "ไม่ตั้ง" : `${m} นาที`}</option>)}
          </select>
          {sleepLeft !== null && <small>เหลือ {Math.floor(sleepLeft / 60)}:{String(sleepLeft % 60).padStart(2, "0")}</small>}
        </label>
      </div>
      <p className="muted small">เสียงอ่านเป็นเสียงสังเคราะห์ของอุปกรณ์ (ชั่วคราว) — อ่านให้ลูกฟังเองก็ดีที่สุด</p>

      {finished && (
        <div className="story__end" data-testid="story-end">
          <h2>จบแล้ว ชวนลูกคุยต่อ</h2>
          <ul>{story.questions.map((q) => <li key={q.th}>{q.th} <span className="muted" lang="en">— {q.en}</span></li>)}</ul>
        </div>
      )}

      {listenOnly && playing && (
        <div className="listen" role="dialog" aria-label="โหมดฟังอย่างเดียว" data-testid="listen-overlay">
          <p>กำลังเล่นนิทาน “{story.title.th}”</p>
          <small>หน้าจอมืดเพื่อพักสายตา วางเครื่องไว้ได้เลย</small>
          <button className="btn btn--light" onClick={stop}>หยุด</button>
          <button className="listen__show" onClick={() => setListenOnly(false)}>แสดงหน้าจอ</button>
        </div>
      )}
    </div>
  );
}
