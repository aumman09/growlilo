import type { ColorId, Lesson, MatchItem } from "./types";
import { createRng, shuffle } from "./rng";

export type Phase = "intro" | "playing" | "complete";
export type EndReason = "completed" | "screen_cap" | "parent_exit";

export interface PlayItem extends MatchItem { order: ColorId[] }

export interface MatchState {
  lessonId: string;
  phase: Phase;
  items: PlayItem[];
  index: number;
  feedback: null | { kind: "correct" | "wrong"; choice: ColorId };
  eliminated: ColorId[];      // wrong choices already tried on this item (softly disabled)
  wrongOnItem: number;
  hintVisible: boolean;
  hintsUsed: number;
  correctFirstTry: number;
  answers: number;            // total taps on choices
  itemsCompleted: number;
  capReached: boolean;
  endedBy: EndReason | null;
}

export type MatchAction =
  | { type: "START" }
  | { type: "ANSWER"; choice: ColorId }
  | { type: "HINT" }
  | { type: "NEXT" }
  | { type: "CAP_REACHED" }
  | { type: "EXIT" };

export function createMatchState(lesson: Lesson, seed: number): MatchState {
  const rng = createRng(seed);
  return {
    lessonId: lesson.id,
    phase: "intro",
    items: lesson.items.map((it) => ({ ...it, order: shuffle(it.choices, rng) })),
    index: 0,
    feedback: null,
    eliminated: [],
    wrongOnItem: 0,
    hintVisible: false,
    hintsUsed: 0,
    correctFirstTry: 0,
    answers: 0,
    itemsCompleted: 0,
    capReached: false,
    endedBy: null,
  };
}

const AUTO_HINT_AFTER_WRONG = 2;

export function matchReducer(s: MatchState, a: MatchAction): MatchState {
  switch (a.type) {
    case "START":
      return s.phase === "intro" ? { ...s, phase: "playing" } : s;

    case "ANSWER": {
      if (s.phase !== "playing" || s.feedback?.kind === "correct") return s;
      const item = s.items[s.index];
      if (!item.order.includes(a.choice) || s.eliminated.includes(a.choice)) return s;
      if (a.choice === item.correct) {
        return {
          ...s,
          feedback: { kind: "correct", choice: a.choice },
          answers: s.answers + 1,
          correctFirstTry: s.correctFirstTry + (s.wrongOnItem === 0 ? 1 : 0),
          itemsCompleted: s.itemsCompleted + 1,
        };
      }
      const wrongOnItem = s.wrongOnItem + 1;
      const autoHint = wrongOnItem >= AUTO_HINT_AFTER_WRONG && !s.hintVisible;
      return {
        ...s,
        feedback: { kind: "wrong", choice: a.choice },
        answers: s.answers + 1,
        wrongOnItem,
        eliminated: [...s.eliminated, a.choice],
        hintVisible: s.hintVisible || autoHint,
        hintsUsed: s.hintsUsed + (autoHint ? 1 : 0),
      };
    }

    case "HINT":
      if (s.phase !== "playing" || s.hintVisible || s.feedback?.kind === "correct") return s;
      return { ...s, hintVisible: true, hintsUsed: s.hintsUsed + 1 };

    case "NEXT": {
      if (s.phase !== "playing" || s.feedback?.kind !== "correct") return s;
      const last = s.index >= s.items.length - 1;
      if (last || s.capReached) {
        return { ...s, phase: "complete", endedBy: last ? "completed" : "screen_cap" };
      }
      return { ...s, index: s.index + 1, feedback: null, eliminated: [], wrongOnItem: 0, hintVisible: false };
    }

    case "CAP_REACHED":
      // Never cut a child off mid-question: just mark it; the session ends after the current item.
      if (s.phase === "complete") return s;
      if (s.phase === "intro") return { ...s, phase: "complete", capReached: true, endedBy: "screen_cap" };
      return { ...s, capReached: true };

    case "EXIT":
      return s.phase === "complete" ? s : { ...s, phase: "complete", endedBy: "parent_exit" };
  }
}

export function currentItem(s: MatchState): PlayItem | undefined {
  return s.items[s.index];
}

export interface LessonResult {
  lessonId: string;
  totalItems: number;
  itemsCompleted: number;
  correctFirstTry: number;
  answers: number;
  hintsUsed: number;
  endedBy: EndReason;
}

export function resultOf(s: MatchState): LessonResult {
  if (s.phase !== "complete" || !s.endedBy) throw new Error("lesson not complete");
  return {
    lessonId: s.lessonId,
    totalItems: s.items.length,
    itemsCompleted: s.itemsCompleted,
    correctFirstTry: s.correctFirstTry,
    answers: s.answers,
    hintsUsed: s.hintsUsed,
    endedBy: s.endedBy,
  };
}
