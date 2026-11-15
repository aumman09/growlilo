export type AgeBand = "2-3" | "4-5" | "6-8" | "9-12";
export type Subject = "english" | "thai" | "math" | "life";
export type Localized = { th: string; en?: string };
export type ColorId = "red" | "blue" | "yellow" | "green" | "orange" | "purple";
export type ObjectKind = "balloon" | "fish" | "star" | "car" | "ball" | "flower";

export interface MatchItem {
  id: string;
  word: string;
  th: string;
  say_th: string;
  object: ObjectKind;
  object_th: string;
  object_en: string;
  correct: ColorId;
  choices: ColorId[];
}

export interface Lesson {
  id: string;
  version: number;
  status: "draft" | "in_review" | "published" | "archived";
  subject: Subject;
  age_bands: AgeBand[];
  engine: "match" | "count" | "build";
  title: Localized;
  intro: Localized;
  parent_tip: Localized;
  duration_screen_seconds: number;
  skill_ids: string[];
  items: MatchItem[];
  linked_mission_id: string | null;
  access_tier: "free" | "plus";
  reviewed_by: string | null;
  safety_reviewed: boolean;
  review_note?: string;
}

export interface Phrase { en: string; th: string; say_th: string }

export interface Mission {
  id: string;
  version: number;
  status: "draft" | "published";
  subject: Subject;
  age_bands: AgeBand[];
  places: Array<"indoor" | "outdoor">;
  duration_minutes: number;
  max_prep_minutes: number;
  materials: string[];
  skill_ids: string[];
  title: Localized;
  child_instruction: Localized;
  adult_steps: string[];
  phrases: Phrase[];
  safety_notes: string[];
  variations: string[];
  completion_question: string;
  access_tier: "free" | "plus";
}

export interface Avatar { id: string; label: string; color: string }
