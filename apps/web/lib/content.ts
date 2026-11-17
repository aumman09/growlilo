import worksheetsJson from "@content/worksheets.json";
import storiesJson from "@content/stories.json";
import { validateStory, validateWorksheet, type Story, type Worksheet } from "@growlilo/game-core";
import lessonsJson from "@content/lessons.json";
import missionsJson from "@content/missions.json";
import plansJson from "@content/plans.json";
import avatarsJson from "@content/avatars.json";
import promptsJson from "@content/prompts.json";
import { publishedOnly, validateLesson, validateMission, type Avatar, type Lesson, type Mission } from "@growlilo/game-core";

export const LESSONS: Lesson[] = publishedOnly((lessonsJson as unknown as Lesson[]).map(validateLesson));
export const MISSIONS: Mission[] = publishedOnly((missionsJson as unknown as Mission[]).map(validateMission));
export const AVATARS: Avatar[] = avatarsJson as Avatar[];
export const PROMPTS: Record<string, string[]> = promptsJson;

export interface PlanCatalog {
  currency: string;
  checkout_enabled: boolean;
  status_label: { th: string; en: string };
  plans: Array<{
    sku: string; name: { th: string; en: string }; price_minor_units: { month: number; year: number };
    tagline: { th: string }; features: string[]; available: boolean;
  }>;
  notes: string[];
}
export const PLAN_CATALOG = plansJson as PlanCatalog;

export const getLesson = (id: string) => LESSONS.find((l) => l.id === id);
export const getMission = (id: string) => MISSIONS.find((m) => m.id === id);

export const SKILL_NAMES: Record<string, string> = {
  "en.colors.basic": "คำศัพท์สี (อังกฤษ)",
  "en.listening.word": "ฟังคำภาษาอังกฤษ",
  "en.speaking.word": "พูดคำภาษาอังกฤษ",
  "cognition.visual_match": "สังเกตและจับคู่",
  "math.counting.1_10": "นับ 1–10",
  "th.consonant.ko": "เสียงพยัญชนะ ก",
  "th.reading.letters": "รู้จักตัวอักษร",
  "life.feelings.naming": "บอกความรู้สึก",
  "cognition.sorting": "จัดกลุ่ม",
};

export const SUBJECT_TH: Record<string, string> = { english: "ภาษาอังกฤษ", thai: "ภาษาไทย", math: "คณิตศาสตร์", life: "ทักษะชีวิต" };

// ---------- Family Library (ages 1–3) ----------

/** All validated items incl. scheduled ones (pages decide visibility by date on the client). */
export const ALL_WORKSHEETS: Worksheet[] = (worksheetsJson as unknown as Worksheet[]).map(validateWorksheet).filter((w) => w.status === "published");
export const ALL_STORIES: Story[] = (storiesJson as unknown as Story[]).map(validateStory).filter((s) => s.status === "published");
export const getWorksheet = (id: string) => ALL_WORKSHEETS.find((w) => w.id === id);
export const getStory = (id: string) => ALL_STORIES.find((s) => s.id === id);

export const SKILL_TH: Record<string, string> = {
  fine_motor: "กล้ามเนื้อมือ", colors: "สีและการระบาย", matching: "จับคู่", counting: "นับจำนวน", concepts: "ใหญ่-เล็ก",
};
export const THEME_TH: Record<string, string> = {
  bedtime: "ก่อนนอน", colors: "สี", routine: "กิจวัตร", feelings: "ความรู้สึก", nature: "ธรรมชาติ", animals: "สัตว์", kindness: "น้ำใจ",
};
