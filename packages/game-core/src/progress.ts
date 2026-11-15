import type { AgeBand, Lesson, Mission, Subject } from "./types";
import type { LessonResult } from "./match-engine";

export const STORE_VERSION = 1;
export const SCREEN_CAP_MIN = 2;
export const SCREEN_CAP_MAX = 8;
export const FAMILY_TIMES = [10, 15, 20, 30] as const;
export type FamilyTime = (typeof FAMILY_TIMES)[number];

export interface ProfileSettings {
  screenCapMinutes: number;   // parent-configured screen segment per session
  familyMinutes: FamilyTime;  // total family activity window (not all screen)
  soundOn: boolean;
  reducedMotion: boolean;
}

export interface ChildProfile {
  id: string;
  nickname: string;           // optional; may be empty — never a real name requirement
  ageBand: AgeBand;
  avatarId: string;
  createdAt: string;
  settings: ProfileSettings;
}

export interface Attempt extends LessonResult {
  id: string;
  profileId: string;
  subject: Subject;
  skillIds: string[];
  startedAt: string;
  finishedAt: string;
}

export interface MissionCompletion {
  id: string;
  profileId: string;
  missionId: string;
  subject: Subject;
  skillIds: string[];
  confirmedByParentAt: string;
  reflection: string | null;  // one of fixed chips, never free text
}

export interface SettingsLogEntry { profileId: string; at: string; change: string }

export interface ProgressState {
  version: number;
  consentAt: string | null;
  profiles: ChildProfile[];
  activeProfileId: string | null;
  attempts: Attempt[];
  missionCompletions: MissionCompletion[];
  settingsLog: SettingsLogEntry[];
}

export const DEFAULT_SETTINGS: ProfileSettings = { screenCapMinutes: 5, familyMinutes: 15, soundOn: true, reducedMotion: false };
export const MAX_LOCAL_PROFILES = 4;

export function emptyState(): ProgressState {
  return { version: STORE_VERSION, consentAt: null, profiles: [], activeProfileId: null, attempts: [], missionCompletions: [], settingsLog: [] };
}

/** Accepts unknown JSON from storage; returns a safe state (never throws). */
export function parseState(raw: unknown): ProgressState {
  if (!raw || typeof raw !== "object") return emptyState();
  const r = raw as Partial<ProgressState>;
  if (r.version !== STORE_VERSION) return emptyState();
  return {
    ...emptyState(),
    ...r,
    profiles: Array.isArray(r.profiles) ? r.profiles : [],
    attempts: Array.isArray(r.attempts) ? r.attempts : [],
    missionCompletions: Array.isArray(r.missionCompletions) ? r.missionCompletions : [],
    settingsLog: Array.isArray(r.settingsLog) ? r.settingsLog : [],
  };
}

export function clampCap(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_SETTINGS.screenCapMinutes;
  return Math.min(SCREEN_CAP_MAX, Math.max(SCREEN_CAP_MIN, Math.round(n)));
}

export function giveConsent(s: ProgressState, at: string): ProgressState {
  return { ...s, consentAt: at };
}

export function addProfile(
  s: ProgressState,
  input: { id: string; nickname: string; ageBand: AgeBand; avatarId: string; settings?: Partial<ProfileSettings> },
  at: string,
): ProgressState {
  if (!s.consentAt) throw new Error("parent consent required before creating a profile");
  if (s.profiles.length >= MAX_LOCAL_PROFILES) throw new Error("profile limit reached");
  const nickname = input.nickname.trim().slice(0, 20);
  const settings = { ...DEFAULT_SETTINGS, ...input.settings };
  settings.screenCapMinutes = clampCap(settings.screenCapMinutes);
  const profile: ChildProfile = { id: input.id, nickname, ageBand: input.ageBand, avatarId: input.avatarId, createdAt: at, settings };
  return { ...s, profiles: [...s.profiles, profile], activeProfileId: profile.id };
}

export function selectProfile(s: ProgressState, id: string): ProgressState {
  return s.profiles.some((p) => p.id === id) ? { ...s, activeProfileId: id } : s;
}

export function updateSettings(s: ProgressState, profileId: string, patch: Partial<ProfileSettings>, at: string): ProgressState {
  const changes: string[] = [];
  const profiles = s.profiles.map((p) => {
    if (p.id !== profileId) return p;
    const next = { ...p.settings, ...patch };
    next.screenCapMinutes = clampCap(next.screenCapMinutes);
    if (next.screenCapMinutes !== p.settings.screenCapMinutes) changes.push(`screenCap ${p.settings.screenCapMinutes}→${next.screenCapMinutes}`);
    if (next.familyMinutes !== p.settings.familyMinutes) changes.push(`familyMinutes ${p.settings.familyMinutes}→${next.familyMinutes}`);
    return { ...p, settings: next };
  });
  const log = changes.map((change) => ({ profileId, at, change }));
  return { ...s, profiles, settingsLog: [...s.settingsLog, ...log].slice(-50) };
}

export function recordAttempt(
  s: ProgressState,
  a: { id: string; profileId: string; lesson: Lesson; result: LessonResult; startedAt: string; finishedAt: string },
): ProgressState {
  if (!s.profiles.some((p) => p.id === a.profileId)) throw new Error("unknown profile");
  if (s.attempts.some((x) => x.id === a.id)) return s; // idempotent (back/forward, double submit)
  const attempt: Attempt = {
    ...a.result,
    id: a.id,
    profileId: a.profileId,
    subject: a.lesson.subject,
    skillIds: a.lesson.skill_ids,
    startedAt: a.startedAt,
    finishedAt: a.finishedAt,
  };
  return { ...s, attempts: [...s.attempts, attempt] };
}

export const REFLECTION_CHIPS = ["ตอนหาของ", "ตอนพูดภาษาอังกฤษ", "ตอนหัวเราะด้วยกัน", "อยากเล่นอีก"] as const;

export function confirmMission(
  s: ProgressState,
  c: { id: string; profileId: string; mission: Mission; reflection: string | null; at: string },
): ProgressState {
  if (!s.profiles.some((p) => p.id === c.profileId)) throw new Error("unknown profile");
  if (s.missionCompletions.some((x) => x.id === c.id)) return s;
  const reflection = c.reflection && (REFLECTION_CHIPS as readonly string[]).includes(c.reflection) ? c.reflection : null;
  const mc: MissionCompletion = {
    id: c.id, profileId: c.profileId, missionId: c.mission.id, subject: c.mission.subject,
    skillIds: c.mission.skill_ids, confirmedByParentAt: c.at, reflection,
  };
  return { ...s, missionCompletions: [...s.missionCompletions, mc] };
}

export function deleteProfile(s: ProgressState, profileId: string): ProgressState {
  const profiles = s.profiles.filter((p) => p.id !== profileId);
  return {
    ...s,
    profiles,
    activeProfileId: s.activeProfileId === profileId ? profiles[0]?.id ?? null : s.activeProfileId,
    attempts: s.attempts.filter((a) => a.profileId !== profileId),
    missionCompletions: s.missionCompletions.filter((m) => m.profileId !== profileId),
    settingsLog: s.settingsLog.filter((l) => l.profileId !== profileId),
  };
}

export function exportProfile(s: ProgressState, profileId: string) {
  return {
    exportedFormat: "growlilo-local-export@1",
    profile: s.profiles.find((p) => p.id === profileId) ?? null,
    attempts: s.attempts.filter((a) => a.profileId === profileId),
    missionCompletions: s.missionCompletions.filter((m) => m.profileId === profileId),
    settingsLog: s.settingsLog.filter((l) => l.profileId === profileId),
  };
}

// ---------- selectors (always scoped by profile) ----------

export type SkillLabel = "ทำได้ในกิจกรรมนี้" | "กำลังฝึก" | "ลองอีกครั้ง";

export function labelForAttempt(a: Pick<Attempt, "correctFirstTry" | "itemsCompleted" | "totalItems">): SkillLabel {
  if (a.itemsCompleted === 0) return "ลองอีกครั้ง";
  const ratio = a.correctFirstTry / a.itemsCompleted;
  if (ratio >= 0.8 && a.itemsCompleted >= Math.ceil(a.totalItems / 2)) return "ทำได้ในกิจกรรมนี้";
  if (ratio >= 0.5) return "กำลังฝึก";
  return "ลองอีกครั้ง";
}

const DAY = 86_400_000;

export interface WeeklySummary {
  lessonsAttempted: number;
  lessonsCompleted: number;
  missionsConfirmed: number;
  minutesOnScreenApprox: number;
  subjects: Record<Subject, number>;
  skills: Array<{ skillId: string; label: SkillLabel; lastAt: string }>;
}

export function weeklySummary(s: ProgressState, profileId: string, now: Date): WeeklySummary {
  const since = now.getTime() - 7 * DAY;
  const attempts = s.attempts.filter((a) => a.profileId === profileId && Date.parse(a.finishedAt) >= since);
  const missions = s.missionCompletions.filter((m) => m.profileId === profileId && Date.parse(m.confirmedByParentAt) >= since);
  const subjects: Record<Subject, number> = { english: 0, thai: 0, math: 0, life: 0 };
  for (const a of attempts) subjects[a.subject]++;
  for (const m of missions) subjects[m.subject]++;
  const skillMap = new Map<string, { label: SkillLabel; lastAt: string }>();
  for (const a of [...attempts].sort((x, y) => x.finishedAt.localeCompare(y.finishedAt))) {
    for (const sk of a.skillIds) skillMap.set(sk, { label: labelForAttempt(a), lastAt: a.finishedAt });
  }
  const ms = attempts.reduce((n, a) => n + (Date.parse(a.finishedAt) - Date.parse(a.startedAt)), 0);
  return {
    lessonsAttempted: attempts.length,
    lessonsCompleted: attempts.filter((a) => a.endedBy === "completed").length,
    missionsConfirmed: missions.length,
    minutesOnScreenApprox: Math.round(ms / 60000),
    subjects,
    skills: [...skillMap.entries()].map(([skillId, v]) => ({ skillId, ...v })),
  };
}

export interface Recommendation { kind: "lesson" | "mission"; targetId: string; title: string; reason: string }

/** Deterministic "Try next" rule set — explainable to parents, no AI personalisation claimed. */
export function recommendNext(
  s: ProgressState, profileId: string, lessons: Lesson[], missions: Mission[],
): Recommendation {
  const profile = s.profiles.find((p) => p.id === profileId);
  const age = profile?.ageBand ?? "4-5";
  const avail = lessons.filter((l) => l.status === "published" && l.age_bands.includes(age));
  const mine = s.attempts.filter((a) => a.profileId === profileId);
  const confirmed = new Set(s.missionCompletions.filter((m) => m.profileId === profileId).map((m) => m.missionId));
  const last = mine[mine.length - 1];

  if (!last) {
    const l = avail[0] ?? lessons[0];
    return { kind: "lesson", targetId: l.id, title: l.title.th, reason: "ยังไม่มีกิจกรรม — เริ่มจากเกมสั้น ๆ 4 นาทีนี้ได้เลย" };
  }
  const lastLesson = lessons.find((l) => l.id === last.lessonId);
  if (lastLesson?.linked_mission_id && !confirmed.has(lastLesson.linked_mission_id)) {
    const m = missions.find((x) => x.id === lastLesson.linked_mission_id);
    if (m) return { kind: "mission", targetId: m.id, title: m.title.th, reason: `ลูกเพิ่งเล่น “${lastLesson.title.th}” — ต่อยอดนอกจอด้วยภารกิจนี้ให้คำศัพท์ติดตัว` };
  }
  const label = labelForAttempt(last);
  if (label !== "ทำได้ในกิจกรรมนี้" && lastLesson) {
    return { kind: "lesson", targetId: lastLesson.id, title: lastLesson.title.th, reason: `ผลล่าสุด “${label}” — เล่นซ้ำอีกครั้งในวันอื่นช่วยให้คุ้นเคยขึ้น (ไม่ต้องรีบ)` };
  }
  const nextMission = missions.find((m) => m.status === "published" && m.age_bands.includes(age) && !confirmed.has(m.id));
  if (nextMission) {
    return { kind: "mission", targetId: nextMission.id, title: nextMission.title.th, reason: "ทำกิจกรรมบนจอได้ดีแล้ว — ลองภารกิจนอกจอใหม่เพื่อฝึกในชีวิตจริง" };
  }
  const l = avail[0] ?? lessons[0];
  return { kind: "lesson", targetId: l.id, title: l.title.th, reason: "ทำครบทุกอย่างที่มีตอนนี้แล้ว — บทเรียนใหม่กำลังจะมา" };
}
