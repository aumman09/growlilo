"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  createMatchState, currentItem, hashString, matchReducer, recordAttempt, resultOf, updateSettings,
  type ChildProfile, type ColorId, type Lesson,
} from "@growlilo/game-core";
import { getLesson } from "@/lib/content";
import { newId, useActiveProfile } from "@/lib/store";
import { chime, speak, stopSpeaking } from "@/lib/audio";
import { RequireProfile } from "./RequireProfile";
import { Lilo } from "@/components/brand/Mascots";
import { COLOR_TH, Toy } from "@/components/brand/Toys";
import { SpeakerIcon } from "@/components/marketing/EnglishSpotlight";

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId)!;
  return <RequireProfile>{(p) => <Player lesson={lesson} profile={p} />}</RequireProfile>;
}

function readSeed(fallback: string): number {
  if (typeof window === "undefined") return hashString(fallback);
  const s = new URLSearchParams(window.location.search).get("seed");
  return s && /^\d+$/.test(s) ? Number(s) : hashString(fallback);
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

function Player({ lesson, profile }: { lesson: Lesson; profile: ChildProfile }) {
  const router = useRouter();
  const { update } = useActiveProfile();
  const [attemptId] = useState(newId);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [state, dispatch] = useReducer(matchReducer, undefined, () => createMatchState(lesson, readSeed(attemptId)));
  const sound = profile.settings.soundOn;
  const capMs = profile.settings.screenCapMinutes * 60_000;
  const elapsed = useRef(0);
  const [warn, setWarn] = useState<"none" | "soon" | "last">("none");
  const saved = useRef(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const item = currentItem(state);

  const say = useCallback((text: string) => { if (sound) speak(text); }, [sound]);
  const promptText = item ? `Find ${item.word}!` : "";

  // Active-time screen cap (pauses while the tab is hidden). Never cuts mid-question.
  useEffect(() => {
    if (state.phase !== "playing") return;
    let last = Date.now();
    const t = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible") elapsed.current += now - last;
      last = now;
      if (elapsed.current >= capMs) { dispatch({ type: "CAP_REACHED" }); setWarn("last"); }
      else if (elapsed.current >= capMs - 60_000) setWarn((w) => (w === "none" ? "soon" : w));
    }, 500);
    return () => window.clearInterval(t);
  }, [state.phase, capMs]);

  // Speak the prompt whenever a new item appears.
  useEffect(() => {
    if (state.phase === "playing" && item && !state.feedback) say(promptText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.index]);

  // Feedback sounds.
  useEffect(() => {
    if (!state.feedback || !item) return;
    if (state.feedback.kind === "correct") {
      if (sound) chime("correct");
      say(`${cap(item.word)} ${item.object_en}! Great job!`);
      window.setTimeout(() => nextRef.current?.focus(), 50);
    } else {
      if (sound) chime("try");
      say(`This is ${state.feedback.choice}. Find ${item.word}!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.feedback, state.answers]);

  // Save once on completion (idempotent by attemptId).
  useEffect(() => {
    if (state.phase !== "complete" || saved.current || !startedAt) return;
    saved.current = true;
    const result = resultOf(state);
    if (result.itemsCompleted === 0 && result.endedBy === "parent_exit") return;
    update((s) => recordAttempt(s, { id: attemptId, profileId: profile.id, lesson, result, startedAt, finishedAt: new Date().toISOString() }));
    if (sound && result.endedBy !== "parent_exit") chime("done");
    stopSpeaking();
  }, [state, startedAt, attemptId, profile.id, lesson, update, sound]);

  useEffect(() => () => stopSpeaking(), []);

  // Keyboard alternative: 1–3 pick choices, Enter/Space on "next" handled by button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.phase !== "playing" || !item) return;
      const n = Number(e.key);
      if (n >= 1 && n <= item.order.length) dispatch({ type: "ANSWER", choice: item.order[n - 1] });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, item]);

  const start = () => {
    setStartedAt(new Date().toISOString());
    dispatch({ type: "START" });
  };

  const exit = () => {
    if (state.phase === "playing" && state.itemsCompleted > 0 && startedAt && !saved.current) {
      saved.current = true;
      const result = resultOf(matchReducer(state, { type: "EXIT" }));
      update((s) => recordAttempt(s, { id: attemptId, profileId: profile.id, lesson, result, startedAt, finishedAt: new Date().toISOString() }));
    }
    stopSpeaking();
    router.push("/app/home/");
  };

  const toggleSound = () => {
    update((s) => updateSettings(s, profile.id, { soundOn: !sound }, new Date().toISOString()));
    if (sound) stopSpeaking();
  };

  // ---------- render ----------
  if (state.phase === "intro") {
    return (
      <main className="screen screen--child lesson lesson--intro">
        <LessonTop onExit={exit} sound={sound} onSound={toggleSound} />
        <div className="intro">
          <Lilo size={150} wave className="anim-float" />
          <p className="intro__en" lang="en">{lesson.title.en}</p>
          <h1>{lesson.title.th}</h1>
          <p className="intro__how">{lesson.intro.th}</p>
          <button className="btn btn--lg btn--peach intro__go" onClick={start} data-testid="lesson-start">เริ่มเลย!</button>
          <p className="intro__parent"><b>สำหรับพ่อแม่:</b> {lesson.parent_tip.th}</p>
        </div>
      </main>
    );
  }

  if (state.phase === "complete") {
    const r = resultOf(state);
    const practised = state.items.slice(0, r.itemsCompleted);
    return (
      <main className="screen screen--child lesson lesson--done" data-testid="lesson-complete">
        <div className="done">
          <Lilo size={150} expr="wow" wave />
          <h1>{r.endedBy === "screen_cap" ? "หมดเวลาจอแล้ว เก่งมาก!" : r.endedBy === "parent_exit" ? "พักก่อนนะ" : "เก่งมาก! เล่นจบแล้ว"}</h1>
          {r.itemsCompleted > 0 && (
            <>
              <p className="done__sub">วันนี้ได้ฝึกคำว่า</p>
              <ul className="done__words">
                {practised.map((it) => (
                  <li key={it.id} lang="en"><span className="swatch" style={{ background: `var(--toy-${it.correct})` }} />{it.word}</li>
                ))}
              </ul>
            </>
          )}
          <p className="done__next">ถึงเวลาพักสายตา แล้วไปเล่นกับพ่อแม่กัน</p>
          <Link className="btn btn--lg btn--peach" href="/app/break/" data-testid="go-break">ไปพักสายตา</Link>
          <Link className="done__home" href="/app/home/">กลับหน้าหลัก</Link>
        </div>
      </main>
    );
  }

  // playing
  if (!item) return null;
  const fb = state.feedback;
  return (
    <main className="screen screen--child lesson">
      <LessonTop onExit={exit} sound={sound} onSound={toggleSound} />
      <div className="hud">
        <ol className="dots" aria-label={`ข้อ ${state.index + 1} จาก ${state.items.length}`}>
          {state.items.map((it, i) => (
            <li key={it.id} className={i < state.itemsCompleted ? "done" : i === state.index ? "now" : ""} />
          ))}
        </ol>
        {warn !== "none" && (
          <span className={`capnote ${warn === "last" ? "capnote--last" : ""}`} role="status" data-testid="cap-note">
            {warn === "last" ? "ข้อนี้ข้อสุดท้ายแล้วนะ" : "อีกนิดเดียวจะได้พักจอ"}
          </span>
        )}
      </div>

      <section className="prompt" aria-live="polite">
        <button className="prompt__say" onClick={() => speak(promptText)} aria-label={`ฟังอีกครั้ง: ${promptText}`} data-testid="replay">
          <SpeakerIcon />
        </button>
        <div>
          <p className="prompt__en" lang="en" data-testid="prompt">Find <b>{item.word}</b>!</p>
          <p className="prompt__cap">อ่านว่า “{item.say_th}” • {item.th}</p>
        </div>
      </section>

      <div className={`choices choices--${item.order.length}`} role="group" aria-label="เลือกคำตอบ">
        {item.order.map((c: ColorId, i) => {
          const isCorrectPick = fb?.kind === "correct" && c === item.correct;
          const isElim = state.eliminated.includes(c);
          const isWrongNow = fb?.kind === "wrong" && fb.choice === c;
          const hint = state.hintVisible && c === item.correct && fb?.kind !== "correct";
          return (
            <button
              key={`${state.index}-${c}`}
              className={`choice ${isCorrectPick ? "is-correct" : ""} ${isElim ? "is-out" : ""} ${isWrongNow ? "is-wrong" : ""} ${hint ? "is-hint" : ""}`}
              onClick={() => dispatch({ type: "ANSWER", choice: c })}
              disabled={isElim || fb?.kind === "correct"}
              aria-label={`${i + 1}. ${item.object_th}${COLOR_TH[c]} (${c})`}
              data-testid={`choice-${c}`}
              data-correct={c === item.correct ? "true" : undefined}
            >
              <Toy kind={item.object} color={c} size={120} />
            </button>
          );
        })}
      </div>

      <div className="fb" aria-live="assertive">
        {fb?.kind === "correct" ? (
          <div className="fb__ok" data-testid="feedback-correct">
            <Lilo size={64} expr="wow" />
            <div>
              <p className="fb__title" lang="en">{cap(item.word)} {item.object_en}!</p>
              <p className="fb__th">เก่งมาก! {item.object_th}{item.th.split(" / ")[0]}</p>
            </div>
            <button ref={nextRef} className="btn btn--lg" onClick={() => dispatch({ type: "NEXT" })} data-testid="next">
              {state.index >= state.items.length - 1 || state.capReached ? "จบเกม" : "ต่อไป"} <span className="arrow" aria-hidden>→</span>
            </button>
          </div>
        ) : fb?.kind === "wrong" ? (
          <div className="fb__try" data-testid="feedback-wrong">
            <Lilo size={56} expr="calm" />
            <p>เกือบแล้ว! อันนั้นคือ <b lang="en">{fb.choice}</b> ({COLOR_TH[fb.choice]}) — ลองหา <b lang="en">{item.word}</b> อีกครั้งนะ</p>
          </div>
        ) : (
          <button className="hintbtn" onClick={() => dispatch({ type: "HINT" })} disabled={state.hintVisible} data-testid="hint">
            {state.hintVisible ? "ดูสิ่งที่เรืองแสงสิ" : "ขอคำใบ้"}
          </button>
        )}
      </div>
    </main>
  );
}

function LessonTop({ onExit, sound, onSound }: { onExit: () => void; sound: boolean; onSound: () => void }) {
  return (
    <header className="ltop">
      <button className="iconbtn" onClick={onExit} aria-label="ออกจากเกม กลับหน้าหลัก" data-testid="exit">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <button className="iconbtn" onClick={onSound} aria-pressed={sound} aria-label={sound ? "ปิดเสียง" : "เปิดเสียง"} data-testid="sound">
        {sound ? <SpeakerIcon /> : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" /><path d="M17 9l5 6M22 9l-5 6" /></svg>
        )}
      </button>
    </header>
  );
}
