# Growlilo — Play. Learn. Grow Together. / เล่นด้วยกัน เรียนรู้ไปด้วยกัน

Thai-first learning companion for families with children aged 4–8:
**Game → Screen break → Parent-child offscreen mission → Parent confirmation → Progress → Next plan.**

> **Status: Phase 1 — Playable Alpha (vertical slice).** See [`docs/ACCEPTANCE_STATUS.md`](docs/ACCEPTANCE_STATUS.md) for what passes and what is still open.
> Not production: no accounts, no payments, progress is stored only in the browser.

## What works now
- Premium scroll-storytelling landing page (all 15 storyboard sections), responsive 320–1440 px, reduced-motion safe, SEO/OG/sitemap/robots
- Working daily-planner teaser (deterministic rules; toddler + 9–12 handling)
- Parent onboarding (consent, age band, optional nickname, curated avatar, family time, screen cap) — no real name/DOB
- Child home + one complete English lesson **“Match Colors”** (6 items, audio prompt, replay, captions, supportive retry, hint, keyboard 1–3)
- Screen cap: finishes the current item, then ends gracefully; never auto-launches another game
- Breathing break → offscreen mission card → **parent gate** → adult mission guide (steps, phrases with audio, safety) → confirm → dashboard
- Parent dashboard: today’s plan, 7-day summary, skills (non-diagnostic labels), “try next” with reasons, history, time settings, export/delete, billing (planned, disabled)
- Installable PWA: manifest, icons (incl. maskable), versioned service worker, offline lesson play + offline fallback page

## Requirements
- Node.js ≥ 20 (tested 22) and pnpm ≥ 9 (`corepack enable` gives you pnpm)

## Setup & run
```bash
pnpm install
pnpm dev                 # http://localhost:3000  (service worker disabled in dev)

# production-like preview (static export + service worker)
pnpm build               # → apps/web/out
pnpm start               # serves apps/web/out on http://localhost:3000
```
Open on a phone on the same Wi-Fi: `http://<your-PC-IP>:3000`. Note: PWA install + service worker require **HTTPS** (or localhost) — use a deploy preview for real-device install tests.

## Quality gates
```bash
pnpm lint && pnpm typecheck && pnpm test     # ESLint, tsc, Vitest (105 unit tests)
pnpm build
cd apps/web && npx playwright install chromium   # first time only
pnpm e2e                                          # 14 Playwright scenarios × 2 viewports (mobile 360, desktop 1440)
```
E2E screenshots land in `apps/web/test-results/shots/`; a curated set is committed in `docs/screenshots/`.

## Deploy (HTTPS preview)
Static output → any HTTPS static host. Security headers are pre-configured:
- **Vercel**: import repo, root `apps/web`, build `pnpm build`, output `out` (uses `vercel.json`)
- **Netlify / Cloudflare Pages**: base `apps/web`, build `pnpm build`, publish `out` (uses `public/_headers`)
- Set `NEXT_PUBLIC_SITE_URL=https://your-domain` (see `.env.example`) so canonical/OG/sitemap URLs are correct.

## Repo map
```
apps/web/            Next.js 15 (App Router, static export) — landing + child/parent PWA
packages/game-core/  Pure TS: match engine, progress store, plan generator, parent gate (+ tests)
content/             Curated JSON: lessons, missions, pricing plans, avatars, prompts
docs/                PRD, ARCHITECTURE, DECISIONS, IMPLEMENTATION_PLAN, ACCEPTANCE_STATUS, screenshots
assets/LICENSES.md   Provenance of every visual/audio asset
```

## Regenerating assets
```bash
cd apps/web
NODE_PATH=$(npm root -g) node scripts/generate-icons.mjs   # needs sharp
pnpm build && npx serve out -l 4321 & node scripts/generate-og.mjs   # needs playwright
```

## Demo data
No demo accounts exist — create a local profile in `/app/welcome`. Nothing is sent to a server. Parent gate = solve a Thai-word arithmetic question.
