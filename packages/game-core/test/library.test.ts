import { describe, expect, it } from "vitest";
import wsJson from "../../../content/worksheets.json";
import storiesJson from "../../../content/stories.json";
import {
  canAccess, hasFeature, isNew, parseLibrary, toggleFavorite, validateStory, validateWorksheet, visibleItems, weeklySet,
  type Story, type Worksheet,
} from "../src";

const worksheets = (wsJson as unknown as Worksheet[]).map(validateWorksheet);
const stories = (storiesJson as unknown as Story[]).map(validateStory);
const NOW = new Date("2026-11-17T08:00:00Z");

describe("library content", () => {
  it("validates all items and ids are unique", () => {
    expect(new Set(worksheets.map((w) => w.id)).size).toBe(worksheets.length);
    expect(new Set(stories.map((s) => s.id)).size).toBe(stories.length);
  });
  it("has a meaningful library with a free sampler (~1/3)", () => {
    const vw = visibleItems(worksheets, NOW), vs = visibleItems(stories, NOW);
    expect(vw.length).toBeGreaterThanOrEqual(24);
    expect(vs.length).toBeGreaterThanOrEqual(12);
    const freeRatio = (xs: { access_tier: string }[]) => xs.filter((x) => x.access_tier === "free").length / xs.length;
    expect(freeRatio(vw)).toBeGreaterThan(0.2);
    expect(freeRatio(vw)).toBeLessThan(0.5);
    expect(freeRatio(vs)).toBeGreaterThan(0.2);
  });
  it("every story page is bilingual", () => {
    for (const s of stories) for (const p of s.pages) { expect(p.th.length).toBeGreaterThan(0); expect(p.en.length).toBeGreaterThan(0); }
  });
  it("rejects bad content", () => {
    const bad = structuredClone(worksheets[0]);
    bad.template = { kind: "match", items: ["fish", "fish"] };
    expect(() => validateWorksheet(bad)).toThrow();
    const s = structuredClone(stories[0]);
    s.pages[0].en = "";
    expect(() => validateStory(s)).toThrow(/both th and en/);
  });
});

describe("publishing schedule (updatable library)", () => {
  it("hides scheduled future items until their date", () => {
    expect(visibleItems(worksheets, NOW).some((w) => w.published_at > "2026-11-17")).toBe(false);
    expect(visibleItems(worksheets, new Date("2026-12-02T00:00:00Z")).some((w) => w.id === "ws-color-tree")).toBe(true);
  });
  it("marks items from the last 30 days as new", () => {
    expect(isNew({ published_at: "2026-11-10" }, NOW)).toBe(true);
    expect(isNew({ published_at: "2026-09-01" }, NOW)).toBe(false);
    expect(isNew({ published_at: "2026-12-01" }, NOW)).toBe(false);
  });
});

describe("free vs Family Plus", () => {
  it("free tier sees only free items; Plus sees all", () => {
    expect(canAccess({ access_tier: "free" }, "free")).toBe(true);
    expect(canAccess({ access_tier: "plus" }, "free")).toBe(false);
    expect(canAccess({ access_tier: "plus" }, "family_plus")).toBe(true);
  });
  it("never paywalls the sleep timer, listen-only mode or printing", () => {
    for (const f of ["sleepTimer", "listenOnlyMode", "print"] as const) expect(hasFeature(f, "free")).toBe(true);
    expect(hasFeature("weeklySet", "free")).toBe(false);
    expect(hasFeature("weeklySet", "family_plus")).toBe(true);
  });
});

describe("weekly set", () => {
  it("is deterministic within a week, changes across weeks, age-appropriate, varied skills", () => {
    const a = weeklySet(worksheets, "2-3", NOW).map((w) => w.id);
    const b = weeklySet(worksheets, "2-3", new Date("2026-11-19T08:00:00Z")).map((w) => w.id);
    const c = weeklySet(worksheets, "2-3", new Date("2026-11-26T08:00:00Z")).map((w) => w.id);
    expect(a).toHaveLength(5);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    const set = weeklySet(worksheets, "1-2", NOW);
    expect(set.every((w) => w.age_bands.includes("1-2"))).toBe(true);
    expect(new Set(weeklySet(worksheets, "2-3", NOW).map((w) => w.skill)).size).toBeGreaterThanOrEqual(3);
  });
});

describe("library local state", () => {
  it("parses safely and toggles favourites", () => {
    expect(parseLibrary("x").favorites).toEqual([]);
    expect(parseLibrary({ version: 1, plusDemo: "yes" }).plusDemo).toBe(false);
    let s = parseLibrary(null);
    s = toggleFavorite(s, "a");
    expect(s.favorites).toEqual(["a"]);
    expect(toggleFavorite(s, "a").favorites).toEqual([]);
  });
});
