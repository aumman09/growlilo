import type { Lesson, Mission } from "./types";

export class ContentError extends Error {}

/** Validates curated content at load time so broken data never reaches a child screen. */
export function validateLesson(l: Lesson): Lesson {
  const fail = (m: string) => { throw new ContentError(`[lesson ${l.id}] ${m}`); };
  if (!l.id || !/^[a-z0-9-]+$/.test(l.id)) fail("invalid id");
  if (l.items.length < 1) fail("needs at least one item");
  const ids = new Set<string>();
  for (const it of l.items) {
    if (ids.has(it.id)) fail(`duplicate item id ${it.id}`);
    ids.add(it.id);
    if (!it.choices.includes(it.correct)) fail(`item ${it.id}: correct answer missing from choices`);
    if (new Set(it.choices).size !== it.choices.length) fail(`item ${it.id}: ambiguous duplicate choices`);
    if (it.choices.length < 2 || it.choices.length > 4) fail(`item ${it.id}: 2–4 choices required`);
  }
  if (l.duration_screen_seconds < 60 || l.duration_screen_seconds > 600) fail("duration must be 1–10 minutes");
  return l;
}

export function validateMission(m: Mission): Mission {
  const fail = (msg: string) => { throw new ContentError(`[mission ${m.id}] ${msg}`); };
  if (!m.child_instruction.th) fail("child instruction required");
  if (m.adult_steps.length === 0) fail("adult steps required");
  if (m.safety_notes.length === 0) fail("safety notes required");
  if (m.duration_minutes < 2 || m.duration_minutes > 30) fail("duration out of range");
  return m;
}

export function publishedOnly<T extends { status: string }>(xs: T[]): T[] {
  return xs.filter((x) => x.status === "published");
}
