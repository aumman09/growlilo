import { describe, expect, it } from "vitest";
import lessonsJson from "../../../content/lessons.json";
import missionsJson from "../../../content/missions.json";
import prompts from "../../../content/prompts.json";
import {
  addProfile, checkGate, confirmMission, createGateChallenge, createMatchState, deleteProfile, emptyState,
  exportProfile, generatePlan, giveConsent, labelForAttempt, matchReducer, parseState, recommendNext, recordAttempt,
  resultOf, sumMinutes, updateSettings, validateLesson, validateMission, weeklySummary,
  type Lesson, type MatchState, type Mission,
} from "../src";

const lessons = (lessonsJson as unknown as Lesson[]).map(validateLesson);
const missions = (missionsJson as unknown as Mission[]).map(validateMission);
const lesson = lessons[0];
const NOW = "2026-11-15T10:00:00.000Z";

function playAllCorrect(s: MatchState): MatchState {
  s = matchReducer(s, { type: "START" });
  while (s.phase === "playing") {
    s = matchReducer(s, { type: "ANSWER", choice: s.items[s.index].correct });
    s = matchReducer(s, { type: "NEXT" });
  }
  return s;
}

describe("content validation", () => {
  it("seed lessons and missions are valid", () => {
    expect(lessons.length).toBeGreaterThan(0);
    expect(missions.length).toBeGreaterThanOrEqual(8);
  });
  it("rejects ambiguous items", () => {
    const bad = structuredClone(lesson);
    bad.items[0].choices = ["blue", "green", "yellow"];
    expect(() => validateLesson(bad)).toThrow(/correct answer missing/);
  });
  it("every lesson's linked mission exists", () => {
    for (const l of lessons) if (l.linked_mission_id) expect(missions.some((m) => m.id === l.linked_mission_id)).toBe(true);
  });
});

describe("match engine", () => {
  it("is deterministic for a seed and keeps the correct choice present", () => {
    const a = createMatchState(lesson, 42);
    const b = createMatchState(lesson, 42);
    expect(a.items.map((i) => i.order)).toEqual(b.items.map((i) => i.order));
    for (const it of a.items) expect(it.order).toContain(it.correct);
  });

  it("wrong then correct: supportive retry, no first-try credit, hint after 2 wrong", () => {
    let s = matchReducer(createMatchState(lesson, 1), { type: "START" });
    const item = s.items[0];
    const wrong = item.order.filter((c) => c !== item.correct);
    s = matchReducer(s, { type: "ANSWER", choice: wrong[0] });
    expect(s.feedback).toEqual({ kind: "wrong", choice: wrong[0] });
    expect(s.hintVisible).toBe(false);
    // same wrong choice cannot be counted twice
    const again = matchReducer(s, { type: "ANSWER", choice: wrong[0] });
    expect(again.answers).toBe(s.answers);
    s = matchReducer(s, { type: "ANSWER", choice: wrong[1] });
    expect(s.hintVisible).toBe(true);
    expect(s.hintsUsed).toBe(1);
    s = matchReducer(s, { type: "ANSWER", choice: item.correct });
    expect(s.feedback?.kind).toBe("correct");
    expect(s.correctFirstTry).toBe(0);
    expect(s.itemsCompleted).toBe(1);
  });

  it("completes naturally with no automatic next lesson", () => {
    const s = playAllCorrect(createMatchState(lesson, 7));
    expect(s.phase).toBe("complete");
    const r = resultOf(s);
    expect(r).toMatchObject({ endedBy: "completed", itemsCompleted: lesson.items.length, correctFirstTry: lesson.items.length });
    expect(matchReducer(s, { type: "START" })).toBe(s);
  });

  it("screen cap finishes the current item first, then ends", () => {
    let s = matchReducer(createMatchState(lesson, 3), { type: "START" });
    s = matchReducer(s, { type: "CAP_REACHED" });
    expect(s.phase).toBe("playing");
    s = matchReducer(s, { type: "ANSWER", choice: s.items[0].correct });
    s = matchReducer(s, { type: "NEXT" });
    expect(s.phase).toBe("complete");
    expect(s.endedBy).toBe("screen_cap");
    expect(resultOf(s).itemsCompleted).toBe(1);
  });

  it("NEXT is ignored until the child answers correctly", () => {
    const s = matchReducer(createMatchState(lesson, 3), { type: "START" });
    expect(matchReducer(s, { type: "NEXT" })).toBe(s);
  });
});

describe("progress store", () => {
  const base = () => giveConsent(emptyState(), NOW);

  it("requires consent and does not require real name", () => {
    expect(() => addProfile(emptyState(), { id: "p1", nickname: "", ageBand: "4-5", avatarId: "sprout" }, NOW)).toThrow();
    const s = addProfile(base(), { id: "p1", nickname: "", ageBand: "4-5", avatarId: "sprout" }, NOW);
    expect(s.profiles[0].nickname).toBe("");
    expect(s.activeProfileId).toBe("p1");
  });

  it("scopes progress per child and is idempotent", () => {
    let s = addProfile(base(), { id: "a", nickname: "A", ageBand: "4-5", avatarId: "sun" }, NOW);
    s = addProfile(s, { id: "b", nickname: "B", ageBand: "6-8", avatarId: "moon" }, NOW);
    const result = resultOf(playAllCorrect(createMatchState(lesson, 1)));
    const rec = { id: "att1", profileId: "a", lesson, result, startedAt: "2026-11-15T09:55:00.000Z", finishedAt: NOW };
    s = recordAttempt(s, rec);
    s = recordAttempt(s, rec);
    expect(s.attempts).toHaveLength(1);
    const now = new Date(NOW);
    expect(weeklySummary(s, "a", now).lessonsAttempted).toBe(1);
    expect(weeklySummary(s, "b", now).lessonsAttempted).toBe(0);
    expect(weeklySummary(s, "a", now).minutesOnScreenApprox).toBe(5);
  });

  it("recommends the linked mission after a lesson, then updates after parent confirmation", () => {
    let s = addProfile(base(), { id: "a", nickname: "", ageBand: "4-5", avatarId: "sun" }, NOW);
    expect(recommendNext(s, "a", lessons, missions).kind).toBe("lesson");
    const result = resultOf(playAllCorrect(createMatchState(lesson, 1)));
    s = recordAttempt(s, { id: "x", profileId: "a", lesson, result, startedAt: NOW, finishedAt: NOW });
    const rec = recommendNext(s, "a", lessons, missions);
    expect(rec).toMatchObject({ kind: "mission", targetId: "mission-find-red-001" });
    const mission = missions.find((m) => m.id === rec.targetId)!;
    s = confirmMission(s, { id: "m1", profileId: "a", mission, reflection: "ไม่อยู่ในรายการ", at: NOW });
    expect(s.missionCompletions[0].reflection).toBeNull(); // only fixed chips are stored
    expect(weeklySummary(s, "a", new Date(NOW)).missionsConfirmed).toBe(1);
    expect(recommendNext(s, "a", lessons, missions).targetId).not.toBe("mission-find-red-001");
  });

  it("clamps screen cap and logs parent setting changes", () => {
    let s = addProfile(base(), { id: "a", nickname: "", ageBand: "4-5", avatarId: "sun" }, NOW);
    s = updateSettings(s, "a", { screenCapMinutes: 99 }, NOW);
    expect(s.profiles[0].settings.screenCapMinutes).toBe(8);
    expect(s.settingsLog).toHaveLength(1);
  });

  it("export and delete are scoped to one child", () => {
    let s = addProfile(base(), { id: "a", nickname: "", ageBand: "4-5", avatarId: "sun" }, NOW);
    s = addProfile(s, { id: "b", nickname: "", ageBand: "4-5", avatarId: "sun" }, NOW);
    const result = resultOf(playAllCorrect(createMatchState(lesson, 1)));
    s = recordAttempt(s, { id: "1", profileId: "a", lesson, result, startedAt: NOW, finishedAt: NOW });
    s = recordAttempt(s, { id: "2", profileId: "b", lesson, result, startedAt: NOW, finishedAt: NOW });
    expect(exportProfile(s, "a").attempts).toHaveLength(1);
    s = deleteProfile(s, "a");
    expect(s.profiles.map((p) => p.id)).toEqual(["b"]);
    expect(s.attempts.map((a) => a.profileId)).toEqual(["b"]);
  });

  it("parseState never throws on garbage", () => {
    expect(parseState(null).profiles).toEqual([]);
    expect(parseState({ version: 999 }).profiles).toEqual([]);
    expect(parseState("x").attempts).toEqual([]);
  });

  it("labels outcomes without diagnostic language", () => {
    expect(labelForAttempt({ correctFirstTry: 6, itemsCompleted: 6, totalItems: 6 })).toBe("ทำได้ในกิจกรรมนี้");
    expect(labelForAttempt({ correctFirstTry: 3, itemsCompleted: 6, totalItems: 6 })).toBe("กำลังฝึก");
    expect(labelForAttempt({ correctFirstTry: 1, itemsCompleted: 6, totalItems: 6 })).toBe("ลองอีกครั้ง");
  });
});

describe("daily plan", () => {
  const P = prompts as Record<string, string[]>;
  for (const age of ["4-5", "6-8"] as const)
    for (const t of [10, 15, 20, 30])
      for (const topic of ["english", "thai", "math", "life", "mix"] as const)
        for (const place of ["indoor", "outdoor"] as const)
          it(`valid plan age ${age} ${t}m ${topic} ${place}`, () => {
            const p = generatePlan({ ageBand: age, totalMinutes: t, topic, place }, lessons, missions, P);
            expect(p.kind).toBe("plan");
            if (p.kind === "roadmap") return;
            expect(sumMinutes(p.segments)).toBe(t);
            const screen = p.segments.find((s) => s.type === "screen");
            if (screen) expect(screen.minutes).toBeLessThanOrEqual(5);
            expect(p.segments.every((s) => s.minutes > 0)).toBe(true);
          });

  it("15-minute English plan matches PRD example 5 + 7 + 3", () => {
    const p = generatePlan({ ageBand: "4-5", totalMinutes: 15, topic: "english", place: "indoor" }, lessons, missions, P);
    expect(p.kind === "plan" && p.segments.map((s) => [s.type, s.minutes])).toEqual([["screen", 5], ["mission", 7], ["talk", 3]]);
  });

  it("ages 2–3 get parent-assisted, offline-first guidance without screen", () => {
    const p = generatePlan({ ageBand: "2-3", totalMinutes: 15, topic: "english", place: "indoor" }, lessons, missions, P);
    expect(p.kind).toBe("parent_assisted");
    if (p.kind !== "roadmap") {
      expect(p.segments.some((s) => s.type === "screen")).toBe(false);
      expect(sumMinutes(p.segments)).toBe(15);
    }
  });

  it("ages 9–12 explains roadmap", () => {
    expect(generatePlan({ ageBand: "9-12", totalMinutes: 15, topic: "mix", place: "indoor" }, lessons, missions, P).kind).toBe("roadmap");
  });
});

describe("parent gate", () => {
  it("challenge is answerable and rejects wrong input", () => {
    for (let seed = 0; seed < 50; seed++) {
      const c = createGateChallenge(seed);
      expect(c.answer).toBeGreaterThan(0);
      expect(checkGate(c, String(c.answer))).toBe(true);
      expect(checkGate(c, String(c.answer + 1))).toBe(false);
      expect(checkGate(c, "")).toBe(false);
    }
  });
});
