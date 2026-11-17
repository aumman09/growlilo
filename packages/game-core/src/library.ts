/**
 * Family Library (ages 1–3): printable worksheets + bilingual stories.
 * Content lives in content/worksheets.json and content/stories.json — add items there, no code change needed.
 */
import { ContentError } from "./content";

export type ToddlerBand = "1-2" | "2-3";
export type Tier = "free" | "plus";
export type PictureKind =
  | "balloon" | "fish" | "star" | "car" | "ball" | "flower"
  | "apple" | "duck" | "sun" | "cloud" | "house" | "heart" | "cat" | "tree" | "moon" | "banana";
export const PICTURE_KINDS: PictureKind[] = [
  "balloon", "fish", "star", "car", "ball", "flower", "apple", "duck", "sun", "cloud", "house", "heart", "cat", "tree", "moon", "banana",
];

export type WorksheetTemplate =
  | { kind: "trace"; pattern: "straight" | "wave" | "zigzag" | "loop" | "steps"; from: PictureKind; to: PictureKind; rows: number }
  | { kind: "color"; picture: PictureKind }
  | { kind: "dots"; picture: PictureKind; count: number }
  | { kind: "match"; items: PictureKind[] }
  | { kind: "count"; picture: PictureKind; max: number }
  | { kind: "size"; picture: PictureKind }
  | { kind: "same"; target: PictureKind; others: PictureKind[] }
  | { kind: "path"; from: PictureKind; to: PictureKind };

export interface Worksheet {
  id: string;
  version: number;
  status: "draft" | "published";
  published_at: string;          // YYYY-MM-DD — drives the "ใหม่" badge
  age_bands: ToddlerBand[];
  access_tier: Tier;
  skill: string;                 // e.g. "fine_motor", "colors", "counting"
  minutes: number;
  title: { th: string; en: string };
  instruction: { th: string; en: string };   // printed on the sheet
  materials: string[];
  adult_tips: string[];
  words: Array<{ th: string; en: string }>;  // talk-together vocabulary
  safety: string[];
  template: WorksheetTemplate;
}

export type SceneBg = "day" | "night" | "garden" | "rain" | "home" | "sea";
export interface StoryPage {
  th: string;
  en: string;
  scene: { bg: SceneBg; cast: Array<"lilo" | "grow">; item?: PictureKind };
}

export interface Story {
  id: string;
  version: number;
  status: "draft" | "published";
  published_at: string;
  age_bands: ToddlerBand[];
  access_tier: Tier;
  theme: string;                 // "bedtime" | "feelings" | "nature" | "routine" | "animals" | "kindness"
  minutes: number;
  title: { th: string; en: string };
  pages: StoryPage[];
  questions: Array<{ th: string; en: string }>; // talk after reading
  audio: { th: string | null; en: string | null }; // licensed recordings when available; null → device speech
  author: string;
}

const ID = /^[a-z0-9-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateWorksheet(w: Worksheet): Worksheet {
  const fail = (m: string) => { throw new ContentError(`[worksheet ${w.id}] ${m}`); };
  if (!ID.test(w.id)) fail("invalid id");
  if (!DATE.test(w.published_at)) fail("published_at must be YYYY-MM-DD");
  if (!w.title.th || !w.title.en) fail("title needs th + en");
  if (!w.instruction.th) fail("instruction.th required");
  if (w.age_bands.length === 0) fail("age_bands required");
  if (w.safety.length === 0) fail("safety notes required");
  if (w.minutes < 2 || w.minutes > 20) fail("minutes out of range");
  const t = w.template;
  const pic = (k: string) => { if (!PICTURE_KINDS.includes(k as PictureKind)) fail(`unknown picture "${k}"`); };
  switch (t.kind) {
    case "trace": pic(t.from); pic(t.to); if (t.rows < 1 || t.rows > 5) fail("trace rows 1–5"); break;
    case "color": pic(t.picture); break;
    case "dots": pic(t.picture); if (t.count < 3 || t.count > 12) fail("dots count 3–12"); break;
    case "match": t.items.forEach(pic); if (t.items.length < 2 || t.items.length > 4 || new Set(t.items).size !== t.items.length) fail("match needs 2–4 distinct items"); break;
    case "count": pic(t.picture); if (t.max < 2 || t.max > 5) fail("count max 2–5"); break;
    case "size": pic(t.picture); break;
    case "same": pic(t.target); t.others.forEach(pic); if (t.others.includes(t.target) || t.others.length < 2) fail("same: others must differ from target"); break;
    case "path": pic(t.from); pic(t.to); break;
    default: fail("unknown template");
  }
  return w;
}

export function validateStory(s: Story): Story {
  const fail = (m: string) => { throw new ContentError(`[story ${s.id}] ${m}`); };
  if (!ID.test(s.id)) fail("invalid id");
  if (!DATE.test(s.published_at)) fail("published_at must be YYYY-MM-DD");
  if (!s.title.th || !s.title.en) fail("title needs th + en");
  if (s.pages.length < 3 || s.pages.length > 16) fail("3–16 pages");
  s.pages.forEach((p, i) => {
    if (!p.th.trim() || !p.en.trim()) fail(`page ${i + 1} needs both th and en text`);
    if (p.scene.item && !PICTURE_KINDS.includes(p.scene.item)) fail(`page ${i + 1} unknown scene item`);
  });
  if (s.questions.length === 0) fail("at least one talk question");
  if (!s.author) fail("author/provenance required");
  return s;
}

// ---------- access (Phase 1: local only; Phase 3 must verify entitlement on the server) ----------

export type PlanSku = "free" | "family_plus";

export function canAccess(item: { access_tier: Tier }, plan: PlanSku): boolean {
  return item.access_tier === "free" || plan === "family_plus";
}

export const PLUS_FEATURES = {
  fullLibrary: "family_plus",
  weeklySet: "family_plus",
  playlist: "family_plus",
  // Deliberately free for everyone (PRD §8.1 — never paywall time limits / safety):
  sleepTimer: "free",
  listenOnlyMode: "free",
  print: "free",
} as const;

export function hasFeature(feature: keyof typeof PLUS_FEATURES, plan: PlanSku): boolean {
  return PLUS_FEATURES[feature] === "free" || plan === "family_plus";
}

/** "New this month" = published in the 30 days before `now`. */
export function isNew(item: { published_at: string }, now: Date): boolean {
  const t = Date.parse(item.published_at + "T00:00:00Z");
  return t <= now.getTime() && now.getTime() - t < 30 * 86_400_000;
}

/** Items visible to families (published and not scheduled for the future). */
export function visibleItems<T extends { status: string; published_at: string }>(xs: T[], now: Date): T[] {
  return xs
    .filter((x) => x.status === "published" && Date.parse(x.published_at + "T00:00:00Z") <= now.getTime())
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

export function isoWeek(d: Date): { year: number; week: number } {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return { year: t.getUTCFullYear(), week: Math.ceil(((t.getTime() - y0.getTime()) / 86_400_000 + 1) / 7) };
}

/**
 * Weekly worksheet set (Plus): deterministic for (age band, ISO week) so the whole family
 * sees the same set all week; rotates through the library and mixes skills.
 */
export function weeklySet(all: Worksheet[], band: ToddlerBand, now: Date, size = 5): Worksheet[] {
  const pool = visibleItems(all, now).filter((w) => w.age_bands.includes(band)).sort((a, b) => a.id.localeCompare(b.id));
  if (pool.length <= size) return pool;
  const { year, week } = isoWeek(now);
  const start = ((year * 53 + week) * size) % pool.length;
  const picked: Worksheet[] = [];
  const skills = new Set<string>();
  for (let i = 0; picked.length < size && i < pool.length * 2; i++) {
    const w = pool[(start + i) % pool.length];
    if (picked.includes(w)) continue;
    if (i < pool.length && skills.has(w.skill)) continue; // first pass: one per skill
    picked.push(w);
    skills.add(w.skill);
  }
  return picked;
}

// ---------- library local state ----------

export interface LibraryState {
  version: 1;
  favorites: string[];          // story ids (bedtime playlist order)
  worksheetsDone: Record<string, string>; // id → ISO date printed/done
  storiesRead: Record<string, number>;   // id → times
  plusDemo: boolean;            // ALPHA ONLY: clearly-labelled preview of Plus, no payment, not an entitlement
}

export function emptyLibrary(): LibraryState {
  return { version: 1, favorites: [], worksheetsDone: {}, storiesRead: {}, plusDemo: false };
}

export function parseLibrary(raw: unknown): LibraryState {
  if (!raw || typeof raw !== "object" || (raw as LibraryState).version !== 1) return emptyLibrary();
  const r = raw as Partial<LibraryState>;
  return {
    version: 1,
    favorites: Array.isArray(r.favorites) ? r.favorites.filter((x) => typeof x === "string") : [],
    worksheetsDone: r.worksheetsDone && typeof r.worksheetsDone === "object" ? r.worksheetsDone : {},
    storiesRead: r.storiesRead && typeof r.storiesRead === "object" ? r.storiesRead : {},
    plusDemo: r.plusDemo === true,
  };
}

export function toggleFavorite(s: LibraryState, id: string): LibraryState {
  return { ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] };
}
