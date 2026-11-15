import type { AgeBand, Lesson, Mission, Subject } from "./types";

export type PlanTopic = Subject | "mix";
export type Place = "indoor" | "outdoor";

export interface PlanInput {
  ageBand: AgeBand;
  totalMinutes: number;      // 10 | 15 | 20 | 30
  topic: PlanTopic;
  place: Place;
  screenCapMinutes?: number; // parent cap; default 5
  recentMissionIds?: string[];
}

export type Segment =
  | { type: "screen"; minutes: number; lessonId: string; title: string }
  | { type: "mission"; minutes: number; missionId: string; title: string; instruction: string }
  | { type: "talk"; minutes: number; prompt: string };

export type PlanOutput =
  | { kind: "plan"; totalMinutes: number; segments: Segment[]; notes: string[] }
  | { kind: "parent_assisted"; totalMinutes: number; segments: Segment[]; notes: string[] }
  | { kind: "roadmap"; notes: string[] };

function talkMinutes(total: number): number {
  if (total <= 10) return 2;
  if (total <= 15) return 3;
  if (total <= 20) return 4;
  return 5;
}

/** Deterministic rule-based plan (PRD §7.1). Invariant: segment minutes always sum to totalMinutes. */
export function generatePlan(
  input: PlanInput, lessons: Lesson[], missions: Mission[], prompts: Record<string, string[]>,
): PlanOutput {
  const total = Math.max(10, Math.min(30, Math.round(input.totalMinutes)));
  if (input.ageBand === "9-12") {
    return { kind: "roadmap", notes: ["ช่วงวัย 9–12 ปีอยู่ในแผนพัฒนา (Phase 4) — ตอนนี้ Growlilo เน้นวัย 4–8 ปี", "ลองภารกิจครอบครัวที่ทำร่วมกันได้ทุกวัยไปก่อน เช่น “หน้าบอกความรู้สึก”"] };
  }
  const recent = new Set(input.recentMissionIds ?? []);
  const subject: Subject = input.topic === "mix" ? "english" : input.topic;
  const missionSubject: Subject = input.topic === "mix" ? "life" : input.topic;
  const prompt = (prompts[input.topic] ?? prompts.mix ?? ["วันนี้สนุกกับอะไร?"])[0];
  const talk = talkMinutes(total);

  const pickMission = (subj: Subject, maxMinutes: number): Mission | undefined => {
    const pool = missions.filter((m) => m.status === "published" && m.age_bands.includes(input.ageBand) && m.places.includes(input.place));
    const ranked = [
      ...pool.filter((m) => m.subject === subj && !recent.has(m.id) && m.duration_minutes <= maxMinutes),
      ...pool.filter((m) => m.subject === subj && m.duration_minutes <= maxMinutes),
      ...pool.filter((m) => m.subject === "life" && m.duration_minutes <= maxMinutes),
      ...pool,
    ];
    return ranked[0];
  };

  if (input.ageBand === "2-3") {
    const missionMin = total - talk;
    const m = pickMission("life", missionMin);
    const segments: Segment[] = [];
    if (m) segments.push({ type: "mission", minutes: missionMin, missionId: m.id, title: m.title.th, instruction: m.child_instruction.th });
    segments.push({ type: "talk", minutes: m ? talk : total, prompt: prompts.life?.[0] ?? prompt });
    return {
      kind: "parent_assisted",
      totalMinutes: total,
      segments,
      notes: ["วัย 2–3 ปี: แนะนำเล่นนอกจอเป็นหลัก ไม่จัดเวลาหน้าจอให้อัตโนมัติ", "หากใช้จอ ให้ผู้ใหญ่ดูด้วยกันสั้น ๆ และพูดคุยไปพร้อมกัน"],
    };
  }

  const lesson = lessons.find((l) => l.status === "published" && l.subject === subject && l.age_bands.includes(input.ageBand));
  const cap = Math.max(2, Math.min(8, input.screenCapMinutes ?? 5));
  const screen = lesson ? Math.min(cap, Math.round(total / 3)) : 0;
  const missionMin = total - talk - screen;
  const notes: string[] = [];
  const segments: Segment[] = [];
  if (lesson) segments.push({ type: "screen", minutes: screen, lessonId: lesson.id, title: lesson.title.th });
  else notes.push("เกมบนจอของวิชานี้กำลังพัฒนา — วันนี้จึงเริ่มจากภารกิจนอกจอได้เลย");
  const preferred = lesson?.linked_mission_id ? missions.find((m) => m.id === lesson.linked_mission_id && m.places.includes(input.place) && !recent.has(m.id)) : undefined;
  const m = preferred ?? pickMission(missionSubject, missionMin);
  if (m) segments.push({ type: "mission", minutes: missionMin, missionId: m.id, title: m.title.th, instruction: m.child_instruction.th });
  segments.push({ type: "talk", minutes: m ? talk : talk + missionMin, prompt });
  notes.push(`เวลาหน้าจอ ${screen} นาที จากทั้งหมด ${total} นาที — ที่เหลือเป็นเวลานอกจอ`);
  return { kind: "plan", totalMinutes: total, segments, notes };
}

export function sumMinutes(segments: Segment[]): number {
  return segments.reduce((n, s) => n + s.minutes, 0);
}
