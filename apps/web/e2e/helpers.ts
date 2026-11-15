import { expect, type Page } from "@playwright/test";

const TH = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ",
  "สิบเอ็ด", "สิบสอง", "สิบสาม", "สิบสี่", "สิบห้า", "สิบหก", "สิบเจ็ด", "สิบแปด", "สิบเก้า", "ยี่สิบ"];

/** Solves the parent gate like an adult reading the Thai question would. */
export async function passGate(page: Page) {
  const q = (await page.getByTestId("gate-question").textContent()) ?? "";
  const [a, op, b] = q.replace("เท่ากับเท่าไร?", "").trim().split(/\s+/);
  const n = (w: string) => TH.indexOf(w);
  const ans = op === "บวก" ? n(a) + n(b) : n(a) - n(b);
  await page.getByLabel(q).fill(String(ans));
  await page.getByRole("button", { name: "ยืนยัน" }).click();
}

export async function onboard(page: Page, opts: { nickname?: string; age?: "4–5 ปี" | "6–8 ปี" } = {}) {
  await page.goto("/app/welcome/");
  const consent = page.getByTestId("consent");
  await consent.or(page.getByRole("radio", { name: /4–5 ปี/ })).first().waitFor();
  if (await consent.isVisible()) {
    await page.getByTestId("consent").check();
    await page.getByRole("button", { name: "เริ่มตั้งค่า" }).click();
  }
  await page.getByRole("radio", { name: new RegExp(opts.age ?? "4–5 ปี") }).click();
  await page.getByRole("button", { name: "ถัดไป" }).click();
  if (opts.nickname) await page.getByLabel("ชื่อเล่น (ไม่บังคับ)").fill(opts.nickname);
  await page.getByRole("button", { name: "ถัดไป" }).click();
  await page.getByRole("button", { name: "สร้างโปรไฟล์" }).click();
  await expect(page.getByRole("heading", { name: "พร้อมแล้ว!" })).toBeVisible();
}

/** Plays the lesson: first item wrong once then right; rest right. */
export async function playLesson(page: Page, { wrongFirst = true } = {}) {
  await page.getByTestId("lesson-start").click();
  for (let i = 0; i < 6; i++) {
    const correct = page.locator("[data-correct=true]");
    if (i === 0 && wrongFirst) {
      await page.locator(".choice:not([data-correct])").first().click();
      await expect(page.getByTestId("feedback-wrong")).toBeVisible();
    }
    await correct.click();
    await expect(page.getByTestId("feedback-correct")).toBeVisible();
    await page.getByTestId("next").click();
  }
  await expect(page.getByTestId("lesson-complete")).toBeVisible();
}
