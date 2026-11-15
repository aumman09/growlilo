import { createRng } from "./rng";

const TH_NUM = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ",
  "สิบเอ็ด", "สิบสอง", "สิบสาม", "สิบสี่", "สิบห้า", "สิบหก", "สิบเจ็ด", "สิบแปด", "สิบเก้า", "ยี่สิบ"];

export interface GateChallenge { question: string; answer: number }

/**
 * Parent gate (PRD §2): a usability barrier that young children are unlikely to pass
 * (requires reading Thai number words + two-digit arithmetic). NOT identity verification.
 */
export function createGateChallenge(seed: number): GateChallenge {
  const rng = createRng(seed);
  const a = 11 + Math.floor(rng() * 9); // 11–19
  const b = 3 + Math.floor(rng() * 7);  // 3–9
  const op = rng() < 0.5 ? "บวก" : "ลบ";
  return { question: `${TH_NUM[a]} ${op} ${TH_NUM[b]} เท่ากับเท่าไร?`, answer: op === "บวก" ? a + b : a - b };
}

export function checkGate(c: GateChallenge, input: string): boolean {
  const n = Number(input.trim());
  return Number.isInteger(n) && n === c.answer;
}

export const GATE_UNLOCK_MS = 10 * 60 * 1000;
