# Decisions & Assumptions Log

| # | Date | Decision | Why | Revisit |
|---|---|---|---|---|
| D1 | 2026-11-15 | Phase 1 uses **Next.js 15 static export** (no FastAPI yet) inside a pnpm monorepo | PRD §11.1 allows a lighter prototype; static export still gives prerendered SEO HTML and deploys to any HTTPS static host | Phase 3 (accounts/billing) |
| D2 | 2026-11-15 | Plain CSS with design tokens (CSS custom properties) instead of Tailwind | Fewer dependencies, finer control of premium editorial look; tokens map 1:1 to PRD §4.1 | If team prefers Tailwind, tokens port directly |
| D3 | 2026-11-15 | Lesson UI in native React (not Phaser) | PRD §11.1: simple quiz UI may be React if more accessible — buttons give keyboard & screen-reader support for free | Phaser only if a game needs physics/canvas |
| D4 | 2026-11-15 | English audio uses the browser **Web Speech API (en-US TTS)** as a stand-in | No licensed native audio was supplied. Captions are always visible; the content schema already has `prompt_audio` for real files | **Must replace** with licensed, reviewed recordings before MVP content release |
| D5 | 2026-11-15 | Mascots are **original SVGs drawn for this repo** (sprout "Lilo" + parent "Grow") | Approved visual references were not provided as files; PRD forbids unlicensed assets | Swap for final illustrator assets; keep same component API |
| D6 | 2026-11-15 | Progress stored in `localStorage` (`growlilo:v1`) behind a `ProgressStore` interface | Fastest reliable persistence for alpha; PRD says prototype storage is not secure identity | Phase 2 → IndexedDB; Phase 3 → API sync |
| D7 | 2026-11-15 | Parent gate = Thai-word arithmetic challenge, unlock 10 min per tab session | PRD §2: must be more than an "I am an adult" button; gate is a usability barrier, not consent | Real auth in Phase 3 |
| D8 | 2026-11-15 | Pricing shown as **"แผนที่วางไว้ (planned)"**; checkout button disabled | PRD §14 Phase 1: no production subscription; no fake checkout | Phase 3 sandbox |
| D9 | 2026-11-15 | Default screen segment 5 min (allowed 2–8), family time 15 min (10/15/20/30) | PRD §18 defaults | Educator review |
| D10 | 2026-11-15 | Thai & Math worlds visible but marked "กำลังปลูก / เร็ว ๆ นี้" in child home and planner falls back to offline-first plan for those subjects | Avoid false availability while keeping IA ready | Next slice (PRD §17 step 4) |
| D11 | 2026-11-15 | Site URL from `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) | Domain not yet confirmed (PRD §18) | Before public launch |
| D12 | 2026-11-15 | Security headers delivered via `public/_headers` (Netlify / Cloudflare Pages) and `vercel.json` | Static export cannot set headers itself | Server deploy |
| D13 | 2026-11-15 | No analytics of any kind in Phase 1 | PRD §13: only privacy-respecting funnel metrics; none chosen yet | Phase 3 |
| D14 | 2026-11-15 | Reflection after a mission uses tap-chips (no free text) | Data minimisation | — |
