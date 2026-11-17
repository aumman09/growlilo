import { expect, test } from "@playwright/test";
import { onboard, passGate, playLesson } from "./helpers";

test.describe("Phase 1 vertical slice: Landing → onboarding → English lesson → break → mission → parent confirm → progress", () => {
  test("QA 1–4: full family flow on mobile", async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // QA1: landing → free try
    await page.goto("/");
    await page.getByRole("link", { name: /ลองกิจกรรมฟรี/ }).first().click();
    await expect(page).toHaveURL(/\/app\/welcome\/$/);

    // QA2: profile without real name or DOB
    await page.getByTestId("consent").check();
    await page.getByRole("button", { name: "เริ่มตั้งค่า" }).click();
    await expect(page.getByRole("radio", { name: /2–3 ปี/ })).toBeDisabled();
    await page.getByRole("radio", { name: /4–5 ปี/ }).click();
    await page.getByRole("button", { name: "ถัดไป" }).click();
    await page.getByRole("button", { name: "ถัดไป" }).click(); // nickname left empty on purpose
    await page.getByRole("button", { name: "สร้างโปรไฟล์" }).click();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-01-onboard-done.png` });
    await page.getByRole("button", { name: /ส่งเครื่องให้ลูก/ }).click();
    await expect(page).toHaveURL(/\/app\/home\/$/);
    await expect(page.getByText("วันนี้เราจะเล่นอะไรดี?")).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-02-child-home.png` });

    // child home: no prices, no external links
    expect(await page.locator("body").textContent()).not.toContain("฿");
    expect(await page.locator('a[href^="http"]').count()).toBe(0);

    await page.getByTestId("quest-card").click();
    await expect(page).toHaveURL(/\/app\/lesson\/en-colors-match-001\/$/);
    await page.screenshot({ path: `test-results/shots/${info.project.name}-03-lesson-intro.png` });
    await page.getByTestId("lesson-start").click();
    await expect(page.getByTestId("prompt")).toContainText("Find");
    // incorrect then correct
    await page.locator(".choice:not([data-correct])").first().click();
    await expect(page.getByTestId("feedback-wrong")).toContainText("เกือบแล้ว");
    await page.screenshot({ path: `test-results/shots/${info.project.name}-04-lesson-wrong.png` });
    await page.locator("[data-correct=true]").click();
    await expect(page.getByTestId("feedback-correct")).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-05-lesson-correct.png` });
    await page.getByTestId("next").click();
    for (let i = 1; i < 6; i++) {
      await page.locator("[data-correct=true]").click();
      await page.getByTestId("next").click();
    }
    await expect(page.getByTestId("lesson-complete")).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-06-lesson-complete.png` });

    // QA3: no auto-launch of next level
    await page.waitForTimeout(2500);
    await expect(page).toHaveURL(/\/app\/lesson\/en-colors-match-001\/$/);
    await expect(page.getByRole("link", { name: /ด่านต่อไป|next level/i })).toHaveCount(0);

    await page.getByTestId("go-break").click();
    await expect(page.getByText("พักสายตากันนะ")).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-07-break.png` });
    await page.getByTestId("skip-rest").click();
    await expect(page.getByTestId("mission-card")).toContainText("นักสำรวจสีแดง");
    await page.screenshot({ path: `test-results/shots/${info.project.name}-08-mission-card.png` });

    // QA4: parent gate → confirm → growth journey increments
    await page.getByTestId("to-mission").click();
    await expect(page.getByRole("heading", { name: "สำหรับผู้ใหญ่เท่านั้น" })).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-09-gate.png` });
    await page.getByLabel(/เท่ากับเท่าไร/).fill("0");
    await page.getByRole("button", { name: "ยืนยัน" }).click();
    await expect(page.locator("#gate-err")).toContainText("ยังไม่ถูก");
    await passGate(page);
    await expect(page.getByRole("heading", { name: /นักสำรวจสีแดง/ })).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${info.project.name}-10-mission-parent.png`, fullPage: true });
    await page.getByRole("radio", { name: "ตอนหาของ" }).click();
    await page.getByTestId("confirm-mission").click();
    await expect(page.getByTestId("mission-confirmed")).toBeVisible();
    await page.getByTestId("to-dashboard").click();
    await expect(page.getByTestId("stat-lessons")).toHaveText("1");
    await expect(page.getByTestId("stat-missions")).toHaveText("1");
    await expect(page.getByTestId("try-next")).not.toContainText("นักสำรวจสีแดง");
    await page.screenshot({ path: `test-results/shots/${info.project.name}-11-dashboard.png`, fullPage: true });

    // QA9: persisted after reload
    await page.reload();
    await expect(page.getByTestId("stat-lessons")).toHaveText("1");
    await expect(page.getByTestId("stat-missions")).toHaveText("1");

    // QA5: change family time to 10 → plan always valid
    await page.locator(".pill", { hasText: "10 นาที" }).click();
    await page.getByTestId("save-settings").click();
    const mins = await page.getByTestId("dash-plan").locator(".tl__min").allTextContents();
    expect(mins.map((m) => parseInt(m)).reduce((a, b) => a + b, 0)).toBe(10);

    expect(errors).toEqual([]);
  });

  test("screen cap: current item finishes, then lesson ends gracefully", async ({ page }) => {
    await page.clock.install();
    await onboard(page);
    // set cap to 2 minutes via parent dashboard
    await page.goto("/app/parent/");
    await passGate(page);
    await page.getByTestId("cap-slider").fill("2");
    await page.getByTestId("save-settings").click();
    await page.goto("/app/lesson/en-colors-match-001/");
    await page.getByTestId("lesson-start").click();
    await page.clock.fastForward("01:05");
    await expect(page.getByTestId("cap-note")).toContainText("อีกนิดเดียว");
    await page.clock.fastForward("01:00");
    await expect(page.getByTestId("cap-note")).toContainText("ข้อสุดท้าย");
    // still able to finish the current question
    await page.locator("[data-correct=true]").click();
    await expect(page.getByTestId("next")).toHaveText(/จบเกม/);
    await page.getByTestId("next").click();
    await expect(page.getByRole("heading", { name: "หมดเวลาจอแล้ว เก่งมาก!" })).toBeVisible();
    await expect(page.getByTestId("go-break")).toBeVisible();
  });

  test("QA7: child route cannot reach billing or purchases without the gate", async ({ page }) => {
    await onboard(page);
    await page.goto("/app/parent/billing/");
    await expect(page.getByRole("heading", { name: "สำหรับผู้ใหญ่เท่านั้น" })).toBeVisible();
    await expect(page.getByText("ชำระเงิน (ยังไม่เปิด)")).toHaveCount(0);
    await page.goto("/app/parent/");
    await expect(page.getByRole("heading", { name: "สำหรับผู้ใหญ่เท่านั้น" })).toBeVisible();
    for (const path of ["/app/home/", "/app/lesson/en-colors-match-001/", "/app/break/"]) {
      await page.goto(path);
      expect(await page.locator('a[href^="http"], a[href^="mailto"]').count(), path).toBe(0);
      expect(await page.locator("body").textContent(), path).not.toContain("฿");
    }
  });

  test("QA8: siblings' progress is isolated", async ({ page }) => {
    await onboard(page, { nickname: "พี่" });
    await page.goto("/app/lesson/en-colors-match-001/");
    await playLesson(page, { wrongFirst: false });
    await onboard(page, { nickname: "น้อง", age: "6–8 ปี" });
    await page.goto("/app/parent/");
    await passGate(page);
    await expect(page.getByRole("tab", { name: /น้อง/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("stat-lessons")).toHaveText("0");
    await page.getByRole("tab", { name: /พี่/ }).click();
    await expect(page.getByTestId("stat-lessons")).toHaveText("1");
  });

  test("QA10: back/forward inside the game does not crash or duplicate attempts", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await onboard(page);
    await page.goto("/app/home/");
    await page.getByTestId("quest-card").click();
    await playLesson(page, { wrongFirst: false });
    await page.goBack();
    await page.goForward();
    await page.goto("/app/parent/");
    await passGate(page);
    await expect(page.getByTestId("stat-lessons")).toHaveText("1");
    expect(errors).toEqual([]);
  });

  test("QA14: export and delete a profile", async ({ page }) => {
    await onboard(page, { nickname: "ทดสอบ" });
    await page.goto("/app/parent/");
    await passGate(page);
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: /ส่งออกข้อมูล/ }).click();
    const file = await dl;
    expect(file.suggestedFilename()).toContain("growlilo-export");
    await page.getByRole("button", { name: "ลบโปรไฟล์นี้" }).click();
    await page.getByRole("button", { name: "ลบถาวร" }).click();
    await expect(page).toHaveURL(/\/app\/welcome\/$/);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("growlilo:v1") ?? "{}"));
    expect(stored.profiles).toEqual([]);
  });

  test("QA6: offline after first load — cached lesson still plays", async ({ page, context }) => {
    await onboard(page);
    await page.goto("/app/home/");
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload(); // controlled by SW now
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
    await context.setOffline(true);
    await page.goto("/app/lesson/en-colors-match-001/");
    await expect(page.getByTestId("offline-chip")).toBeVisible();
    await playLesson(page, { wrongFirst: false });
    await page.goto("/app/does-not-exist/");
    await expect(page.getByRole("heading", { name: "ตอนนี้ออฟไลน์อยู่" })).toBeVisible();
    await context.setOffline(false);
  });

  test("QA12: keyboard-only play", async ({ page }) => {
    await onboard(page);
    await page.goto("/app/lesson/en-colors-match-001/");
    await page.getByTestId("lesson-start").focus();
    await page.keyboard.press("Enter");
    const order = await page.locator(".choice").evaluateAll((els) => els.findIndex((e) => e.getAttribute("data-correct") === "true"));
    await page.keyboard.press(String(order + 1));
    await expect(page.getByTestId("feedback-correct")).toBeVisible();
    await expect(page.getByTestId("next")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".dots li.done")).toHaveCount(1);
  });
});
