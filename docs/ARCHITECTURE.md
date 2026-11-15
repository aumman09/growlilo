# Growlilo — Architecture (Phase 1 / Playable Alpha slice)

> Source of truth: `GROWLILO_MASTER_PRD_v1.0.md` (copied in `docs/`). This file describes what is **actually built now** and the migration path to the PRD's production architecture.

## 1. Surfaces

| Surface | Route(s) | Audience | Status |
|---|---|---|---|
| Marketing landing | `/` | Parents (visitors) | ✅ built — 15 storyboard sections |
| Legal / help | `/privacy`, `/terms`, `/refunds`, `/contact` | Parents | ✅ drafts, clearly marked "ร่าง – รอตรวจทางกฎหมาย" |
| Parent onboarding | `/app/welcome` | Parent | ✅ |
| Profile picker | `/app/select-child` | Parent / child | ✅ |
| Child home | `/app/home` | Child (4–8) | ✅ English playable; Thai/Math shown as "กำลังปลูก" (not available) |
| Lesson player | `/app/lesson/[id]` | Child | ✅ engine G1 (Match) + 1 English lesson |
| Screen break | `/app/break` | Child | ✅ |
| Mission (parent) | `/app/mission/[id]` | Parent (gated) | ✅ |
| Parent dashboard | `/app/parent` | Parent (gated) | ✅ progress, plan, settings, export/delete |
| Billing | `/app/parent/billing` | Parent (gated) | ⏸ "planned" — checkout disabled |
| Offline fallback | `/app/offline` | All | ✅ |
| Admin CMS `/studio` | — | Editor | ❌ Phase 2+ |

The three audiences share one design-token set (`apps/web/styles/tokens.css`) but use separate layouts:
`app/(marketing)/layout.tsx` (navbar, footer, sticky CTA) vs `app/app/layout.tsx` (no marketing CTA, no external links).

## 2. Repository layout

```text
growlilo/
├── apps/web/                 Next.js 15 App Router, static export (output: 'export')
│   ├── app/(marketing)/      landing + legal pages
│   ├── app/app/              child + parent PWA routes
│   ├── components/           marketing/, app/, brand/ (original SVG mascots)
│   ├── lib/                  browser adapters: storage, audio (TTS + WebAudio), parent gate session
│   ├── public/               manifest, icons, og image
│   ├── scripts/              postbuild service-worker generator, icon generator
│   └── e2e/                  Playwright tests + screenshot capture
├── packages/game-core/       Pure TypeScript (no React): content types, match engine reducer,
│                             seeded RNG, progress store, daily-plan generator, parent-gate challenge
├── content/                  Curated seed data (JSON): lessons, missions, plans (pricing), avatars
└── docs/                     PRD, architecture, decisions, plan, acceptance status
```

## 3. Data flow

```text
content/*.json ──import──▶ game-core (validate + typed) ──▶ React pages
                                    │
                    reducer actions (answer, hint, finish)
                                    ▼
           ProgressState (profiles, attempts, missionCompletions, settings)
                                    │  pure functions
                                    ▼
             lib/storage.ts  ⇄  localStorage key `growlilo:v1`   (Phase 2 → IndexedDB + API sync)
```

* All lesson/mission/pricing content is data-driven JSON with stable IDs, versions, `status`, `access_tier`, `age_bands`, `skill_ids` (PRD §10). The UI never hard-codes lesson content or prices.
* Every attempt / mission completion is stored with `profileId`; selectors always filter by profile, so siblings are isolated (QA #8).
* Stored fields per attempt: id, profileId, lessonId, subject, skillIds, startedAt, finishedAt, correct, attempted, hintsUsed, endedBy (`completed` | `screen_cap`). No voice, image, name or DOB.

## 4. Lesson engine (shared)

`intro → activity[1..N] → feedback → completion → break/mission` implemented as a pure reducer
(`packages/game-core/src/match-engine.ts`). The React player only renders state and dispatches actions,
so the same reducer is unit-tested deterministically (seeded shuffle, `?seed=` override for QA).

Screen cap: the player tracks elapsed active time; when the parent-configured cap is reached the
**current item is allowed to finish**, then the session moves to `completion` with `endedBy: "screen_cap"`.
There is never an automatic next lesson.

## 5. Safety boundaries in code

* `app/app/*` routes render no prices, no checkout, no `<a href="http…">` to external origins (enforced by e2e test).
* Parent routes (`/app/parent/*`, `/app/mission/*`) are wrapped in `<ParentGate>` — an arithmetic challenge written in Thai words, unlocked for 10 minutes in `sessionStorage`. This is a **usability barrier only**, not identity verification (PRD §2); real parent auth arrives in Phase 3.
* No third-party scripts, analytics, fonts CDN or trackers anywhere; fonts are self-hosted via `@fontsource` (OFL).

## 6. PWA

* `public/manifest.webmanifest`, icons 192/512 + maskable + apple-touch.
* `scripts/postbuild-sw.mjs` scans the static export and writes `out/sw.js` with a versioned precache list (app shell, lesson pages, fonts, icons). Navigation = network-first → cache → `/app/offline/`. No auth/payment endpoints exist yet; the SW is written to bypass any `/api/` path.

## 7. Migration path to PRD production stack

| Now (Phase 1) | Later |
|---|---|
| Static export | Next.js server rendering + middleware for auth & security headers |
| localStorage store behind `ProgressStore` interface | IndexedDB (Phase 2) + FastAPI `/api/v1/attempts` sync (Phase 3) |
| Parent gate only | Magic-link parent auth, HttpOnly cookies, CSRF |
| `content/*.json` | Postgres `lessons`/`missions` tables + `/studio` CMS with review workflow |
| Pricing JSON, checkout disabled | Server plan catalog + hosted checkout + signed webhooks + entitlements |
| Web Speech API TTS | Licensed, educator-reviewed native audio files (`prompt_audio` field already in schema) |
