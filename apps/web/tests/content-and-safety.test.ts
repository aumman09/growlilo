import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { LESSONS, MISSIONS, PLAN_CATALOG, AVATARS, SKILL_NAMES } from "@/lib/content";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("seed content wiring", () => {
  it("every published lesson links to an existing mission and named skills", () => {
    for (const l of LESSONS) {
      if (l.linked_mission_id) expect(MISSIONS.map((m) => m.id)).toContain(l.linked_mission_id);
      for (const s of l.skill_ids) expect(SKILL_NAMES[s], s).toBeTruthy();
    }
  });
  it("every mission has safety notes and named skills", () => {
    for (const m of MISSIONS) {
      expect(m.safety_notes.length).toBeGreaterThan(0);
      for (const s of m.skill_ids) expect(SKILL_NAMES[s], s).toBeTruthy();
    }
  });
  it("avatars are curated (no uploads)", () => {
    expect(AVATARS.length).toBeGreaterThanOrEqual(4);
  });
  it("checkout stays disabled until a real payment integration exists", () => {
    expect(PLAN_CATALOG.checkout_enabled).toBe(false);
    expect(PLAN_CATALOG.plans.find((p) => p.sku === "family_plus")?.available).toBe(false);
  });
});

describe("child-area static safety scan", () => {
  const appFiles = walk(join(__dirname, "..", "app", "app")).filter((f) => f.endsWith(".tsx") && !f.includes(`${join("app", "parent")}`) && !f.includes("billing"));
  it("child routes contain no external links, prices, or third-party scripts", () => {
    for (const f of appFiles) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/href=["{`]https?:/);
      expect(src, f).not.toMatch(/฿|PLAN_CATALOG/);
      expect(src, f).not.toMatch(/<script[^>]+src=/);
    }
  });
  it("no hardcoded prices in components (prices come from content/plans.json)", () => {
    const comps = walk(join(__dirname, "..", "components")).filter((f) => f.endsWith(".tsx"));
    for (const f of comps) expect(readFileSync(f, "utf8"), f).not.toMatch(/฿\s?\d/);
  });
});
