# Acceptance Status — Phase 1 slice (2026-11-15)

Legend: ✅ pass (automated test or verified) · 🟡 partial · ❌ not started (later phase) · 🔍 needs human/real-device check

Evidence: `pnpm test` (105 unit), `pnpm e2e` (14 scenarios × mobile-360 + desktop-1440 = 28 runs, all green), screenshots in `docs/screenshots/`.

## PRD §15 — Marketing
| Criterion | Status | Evidence / note |
|---|---|---|
| Responsive 320–1440, no horizontal overflow | ✅ | `landing.spec` checks 320/360/390/430/768/1024/1440 |
| Scroll storytelling, coherent visuals, reduced-motion works | ✅ | 15 sections; reduced-motion test asserts every section visible |
| Hero CTAs → free demo + how-it-works anchor | ✅ | `landing.spec` |
| Planner teaser: age/time/topic, toddler warning | ✅ | 2–3 → parent-assisted no-screen; 9–12 → roadmap; minutes always sum to total (80 unit cases) |
| Pricing transparent; checkout disabled; no fake testimonials | ✅ | prices from `content/plans.json`; “ออกแบบเพื่อ…” section instead of quotes |
| SEO metadata, OG image, sitemap, legal links, footer | ✅ | `landing.spec`; legal pages are **drafts** pending legal review |
| Lighthouse ≥85/95/90 | 🔍 | not measured yet — run on deployed HTTPS preview |

## PRD §15 — App
| Criterion | Status | Evidence / note |
|---|---|---|
| Local profile without real name or DOB | ✅ | nickname optional, age band only |
| Finish 1 English, 1 Math, 1 Thai game | 🟡 | **English ✅**. Math (G2) and Thai (G3) are the next slice (PRD §17 step 4) — shown as “กำลังปลูก” |
| Results persist after reload, scoped by child | ✅ | QA8 siblings + QA9 reload tests |
| Parent sets screen cap; game ends naturally; break shows mission | ✅ | clock-mocked cap test; current item always finishes |
| Child cannot reach purchases/external links without adult action | ✅ | QA7 + static scan unit test; gate is usability barrier only (no auth yet) |
| Parent confirms mission; dashboard counts + next recommendation update | ✅ | QA1–4 test |
| Offline: loaded games work; meaningful fallback | ✅ | QA6 (service worker, `context.setOffline`) |
| Parent controls understandable without training | 🔍 | needs 5-parent usability test |

## PRD §15 — Monetization
All ❌ by design for Phase 1 (PRD §14: “No production subscription yet”). Billing page exists, adult-gated, button disabled. Planned for Phase 3: hosted checkout sandbox, signed webhooks, idempotent entitlements, cancel/refund flows.

## PRD §15 — Quality
| Criterion | Status | Note |
|---|---|---|
| Typecheck / lint / unit / integration pass in CI | ✅ local · 🟡 CI | `.github/workflows/ci.yml` written; not yet run on GitHub |
| Browser matrix Android Chrome, iOS Safari, tablet | 🟡 | Chromium emulation only (360 mobile, 1440 desktop). **Real Android/iPhone/WebKit testing outstanding** |
| No third-party trackers; CSP/security headers; no secrets in bundle | ✅ / 🟡 | no external scripts at all; headers configured for Vercel/Netlify but only effective once deployed |
| Accessibility labels, contrast, reduced motion, touch targets | 🟡 | labels/roles, ≥44px targets, focus rings, keyboard play (QA12) done; no axe/Lighthouse audit yet |
| Copy reviewed for Thai clarity, English pronunciation, age fit | ❌ | **needs educator review**; audio is device TTS placeholder |

## PRD §16 QA scenarios
| # | Scenario | Status |
|---|---|---|
| 1 | 360px landing → free try → welcome | ✅ |
| 2 | Age-5 profile, English colour lesson wrong→right | ✅ |
| 3 | No auto next level; mission + gentle break | ✅ |
| 4 | Gate → confirm red-objects mission → journey increments | ✅ |
| 5 | Change to 10 min → plan valid | ✅ |
| 6 | Offline cached lesson; checkout blocked | ✅ (checkout disabled globally) |
| 7 | Guest from child route can’t reach billing | ✅ |
| 8 | Siblings isolated | ✅ |
| 9 | Refresh persistence | ✅ (same tab; cross-tab via `storage` event, not separately tested) |
| 10 | Back/forward no crash/duplication | ✅ |
| 11 | Tiny Android / iOS safe-area / landscape tablet | 🟡 safe-area CSS + landscape rules; not device-tested |
| 12 | Reduced-motion & keyboard-only | ✅ |
| 13 | Forged/duplicate webhooks | ❌ Phase 3 |
| 14 | Export / delete | ✅ (local scope) |
| 15 | Editor rejects unreviewed publish | ❌ Phase 2 CMS (content loader already rejects invalid/ambiguous items) |

## Known issues / honest gaps
1. **No HTTPS deploy preview yet** — needs a hosting account (Vercel/Netlify). Everything is ready for it.
2. English audio uses device speech synthesis; quality varies by device/voice; some Android devices lack an en-US voice offline. Captions always shown.
3. Parent gate is not identity verification and progress lives in `localStorage` (can be evicted by the browser).
4. Mascots are original placeholders; final illustration set pending.
5. Legal pages are drafts; PDPA review required before any real launch or payment.
