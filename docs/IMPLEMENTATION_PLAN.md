# Implementation Plan (follows PRD §17 vertical slices)

| Step | Scope | Status |
|---|---|---|
| 1 | Docs: ARCHITECTURE, DECISIONS, this plan | ✅ done |
| 2 | Monorepo scaffold, design tokens, original mascot SVGs, premium responsive landing (15 sections), legal drafts, SEO | ✅ done |
| 3 | Child home + **one complete English lesson** (Match Colors) with audio, progress save, screen cap, break, offline parent mission, parent gate, confirmation, dashboard | ✅ done |
| 3b | PWA shell: manifest, icons, versioned service worker, offline fallback | ✅ done |
| 4 | Generalise engine: G2 Counting (Math), G3 Letter/Word building (Thai + English phonics); 6–10 seeded lessons; deterministic daily plan in app; richer dashboard | ⏭ next |
| 5 | IndexedDB, offline asset strategy, full accessibility + device QA (Android Chrome, iOS Safari, tablet) | ⏭ |
| 6 | FastAPI + Postgres, parent magic-link auth, `/studio` CMS with review workflow, payment sandbox + webhooks + entitlements | ⏭ |
| 7 | Deploy pipeline (CI, staging/prod), seed scripts, demo accounts, changelog | partial (CI workflow file + README) |

## Content to produce for step 4 (needs educator review)
- English: Animals, Food, Home, Family packs (word, Thai help, parent phrase, linked mission) — ≥10 parent scripts.
- Thai: ก–ฮ sound/picture (4–5), simple spelling (6–8).
- Math: counting 1–10 (4–5), add/subtract within 10 (6–8).
- ≥30 family missions with safety notes.
