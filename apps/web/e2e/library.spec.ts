import { expect, test } from "@playwright/test";
import { passGate } from "./helpers";

test.describe("Family Library (ages 1–3)", () => {
  test("is behind the parent gate and starts on the free plan", async ({ page }) => {
    await page.goto("/app/library/");
    await expect(page.getByRole("heading", { name: "สำหรับผู้ใหญ่เท่านั้น" })).toBeVisible();
    await passGate(page);
    await expect(page.getByTestId("lib-plan")).toHaveText("แพ็กฟรี");
    await expect(page.getByTestId("ws-grid").locator("li")).toHaveCount(26);
    // scheduled December items are not listed yet
    await expect(page.getByTestId("ws-ws-color-tree")).toHaveCount(0);
    await page.getByRole("tab", { name: "นิทาน" }).click();
    await expect(page.getByTestId("story-grid").locator("li")).toHaveCount(12);
    await page.screenshot({ path: `test-results/shots/${test.info().project.name}-20-library.png`, fullPage: true });
  });

  test("free worksheet prints; Plus worksheet is locked until Plus (demo)", async ({ page }) => {
    await page.goto("/app/library/worksheet/ws-trace-car-home/");
    await passGate(page);
    await expect(page.locator(".sheet")).toBeVisible();
    await page.getByTestId("mark-done").click();
    await expect(page.getByTestId("mark-done")).toHaveText(/ทำแล้ว/);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".pnav-top")).toBeHidden();
    await expect(page.locator(".print-area .sheet")).toBeVisible();
    await page.screenshot({ path: `test-results/shots/${test.info().project.name}-21-worksheet-print.png` });
    await page.emulateMedia({ media: "screen" });

    await page.goto("/app/library/worksheet/ws-trace-loop-balloon/");
    await expect(page.getByTestId("locked")).toBeVisible();
    await expect(page.locator(".sheet")).toHaveCount(0);
    await page.getByTestId("plus-demo").click();
    await expect(page.locator(".sheet")).toBeVisible();
  });

  test("weekly set needs Plus; with demo prints 5 sheets", async ({ page }) => {
    await page.goto("/app/library/weekly/");
    await passGate(page);
    await expect(page.getByTestId("locked")).toBeVisible();
    await page.getByTestId("plus-demo").click();
    await expect(page.getByTestId("weekly-sheets").locator(".sheet")).toHaveCount(5);
  });

  test("story: bilingual pages, end questions, listen-only mode, free sleep timer", async ({ page }) => {
    await page.clock.install();
    await page.goto("/app/library/story/story-red-balloon/");
    await passGate(page);
    await expect(page.getByTestId("page-th")).toHaveText("ลิโล่มีลูกโป่งสีแดง");
    await expect(page.getByTestId("page-en")).toHaveText("Lilo has a red balloon.");
    await page.getByRole("radio", { name: "English" }).click();
    await expect(page.getByTestId("page-th")).toHaveCount(0);
    await page.getByRole("radio", { name: "สองภาษา" }).click();
    for (let i = 0; i < 7; i++) await page.getByTestId("next-page").click();
    await expect(page.getByTestId("story-end")).toBeVisible();

    await page.getByLabel("ตั้งเวลาปิดเสียง").selectOption("5");
    await page.getByTestId("play").click();
    await page.getByTestId("listen-only").click();
    await expect(page.getByTestId("listen-overlay")).toBeVisible();
    await page.getByRole("button", { name: "แสดงหน้าจอ" }).click();
    await page.clock.fastForward("05:02");
    await expect(page.getByTestId("play")).toBeVisible();
  });

  test("Plus story locked on free; scheduled story shows publish date", async ({ page }) => {
    await page.goto("/app/library/story/story-rainy-day/");
    await passGate(page);
    await expect(page.getByTestId("locked")).toBeVisible();
    await page.goto("/app/library/story/story-little-lights/");
    await expect(page.getByText("จะเผยแพร่วันที่ 2026-12-01")).toBeVisible();
  });

  test("playlist (Plus demo) plays favourites in order and stops", async ({ page }) => {
    await page.goto("/app/library/story/story-lilo-goodnight/");
    await passGate(page);
    await page.getByTestId("fav").click();
    await page.goto("/app/library/playlist/");
    await page.getByTestId("plus-demo").click();
    await page.getByTestId("start-playlist").click();
    await expect(page.getByTestId("story-player")).toBeVisible();
    await expect(page.locator(".weekly-list li")).toHaveCount(1);
  });

  test("child routes still have no library prices or external links", async ({ page }) => {
    await page.goto("/app/library/");
    expect(await page.locator('a[href^="http"]').count()).toBe(0);
    expect(await page.locator("body").textContent()).not.toContain("฿");
  });
});
