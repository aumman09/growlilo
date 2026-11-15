import { expect, test } from "@playwright/test";

test.describe("marketing landing", () => {
  test("no horizontal overflow across breakpoints", async ({ page }) => {
    for (const w of [320, 360, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `width ${w}`).toBeLessThanOrEqual(0);
    }
  });

  test("hero CTAs go to free demo and how-it-works anchor", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(/เล่นด้วยกัน/);
    await expect(page.getByRole("link", { name: /ลองกิจกรรมฟรี/ }).first()).toHaveAttribute("href", "/app/welcome/");
    await page.getByRole("link", { name: "ดูวิธีเล่น 3 ขั้นตอน" }).click();
    await expect(page).toHaveURL(/#how$/);
    await expect(page.locator("#how")).toBeInViewport();
  });

  test("planner teaser: valid 15-min plan, toddler warning, 9–12 roadmap", async ({ page }) => {
    await page.goto("/#planner");
    const segs = page.getByTestId("plan-segments").locator("li");
    await expect(segs).toHaveCount(3);
    const mins = await segs.locator(".tl__min").allTextContents();
    expect(mins.map((m) => parseInt(m)).reduce((a, b) => a + b, 0)).toBe(15);
    await page.locator(".seg__opt", { hasText: "10 นาที" }).click();
    const mins10 = await page.getByTestId("plan-segments").locator(".tl__min").allTextContents();
    expect(mins10.map((m) => parseInt(m)).reduce((a, b) => a + b, 0)).toBe(10);
    await page.locator(".seg__opt", { hasText: "2–3 ปี" }).click();
    await expect(page.getByTestId("plan-toddler")).toBeVisible();
    await expect(page.getByTestId("plan-segments")).not.toContainText("เกมบนจอ");
    await page.locator(".seg__opt", { hasText: "9–12 ปี" }).click();
    await expect(page.getByTestId("plan-roadmap")).toContainText("Phase 4");
  });

  test("pricing is transparent and checkout disabled; FAQ keyboard operable", async ({ page }) => {
    await page.goto("/#pricing");
    await expect(page.getByTestId("plan-family_plus")).toContainText("฿99");
    await page.getByRole("radio", { name: "รายปี" }).click();
    await expect(page.getByTestId("plan-family_plus")).toContainText("฿899");
    await expect(page.getByRole("button", { name: /ยังไม่เปิดชำระเงิน/ })).toBeDisabled();
    const q = page.getByRole("button", { name: "ลูกจะใช้จอนานแค่ไหน?" });
    await q.focus();
    await page.keyboard.press("Enter");
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("ค่าเริ่มต้นคือเกมบนจอประมาณ 5 นาที")).toBeVisible();
  });

  test("SEO metadata, OG image, sitemap, robots, legal links", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Growlilo/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Growlilo/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-image\.png/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
    expect((await request.get("/og-image.png")).ok()).toBe(true);
    expect(await (await request.get("/sitemap.xml")).text()).toContain("<urlset");
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /app/");
    for (const name of ["ความเป็นส่วนตัว", "ข้อกำหนดการใช้งาน", "การยกเลิกและคืนเงิน"]) {
      await expect(page.locator("footer").getByRole("link", { name })).toBeVisible();
    }
    expect(await page.locator("h1").count()).toBe(1);
  });

  test("reduced motion keeps every section visible", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length);
    expect(hidden).toBe(0);
    await ctx.close();
  });
});
