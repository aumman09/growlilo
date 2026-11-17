# Changelog

## 0.2.0 — 2026-11-17 — Family Library (ages 1–3)
- 28 original printable worksheets (26 live + 2 scheduled for Dec) across 8 templates; A4 print/PDF
- 13 original bilingual stories (12 live + 1 scheduled) with TH/EN/both reading, device narration, listen-only dark mode, sleep timer
- Free vs Family Plus split; weekly worksheet set and bedtime playlist (Plus); alpha Plus demo switch
- Landing section + FAQ + pricing bullets; entry points from dashboard and onboarding
- Pricing: Family Plus planned at 59 THB/month (590/year); owner contact email

## 0.1.0 — 2026-11-15 — Phase 1 Playable Alpha (vertical slice)
- Monorepo (pnpm): `apps/web` (Next.js 15 static export), `packages/game-core`, `content/`
- Landing page: 15 sections, planner teaser, pricing from config (checkout disabled), FAQ, legal drafts, SEO/OG/sitemap/robots
- App: onboarding, profile picker, child home, English “Match Colors” lesson (engine G1), screen cap, break, mission, parent gate, mission confirmation, dashboard, export/delete, billing placeholder
- PWA: manifest, icons, generated service worker, offline fallback
- Tests: 105 unit (Vitest) + 28 E2E runs (Playwright, mobile 360 & desktop 1440)
