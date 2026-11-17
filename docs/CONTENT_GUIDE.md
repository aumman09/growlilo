# Content Guide — adding worksheets & stories (Family Library, ages 1–3)

The library is **data-driven**: add or edit JSON, push to GitHub, and Vercel rebuilds the site. No component code changes needed.
(A web CMS with review workflow is planned for Phase 2 — PRD §10.)

## Files
| File | What |
|---|---|
| `content/worksheets.json` | Printable A4 worksheets |
| `content/stories.json` | Bilingual stories (TH + EN per page) |
| `content/plans.json` | Plan names, prices, feature bullets shown on the site |

## Publishing & monthly updates
- `status`: `"draft"` (hidden) or `"published"`.
- `published_at` (`YYYY-MM-DD`): items with a **future date are hidden automatically** until that day, then appear with a “ใหม่” badge for 30 days. So you can load next month’s drop in advance (see `ws-color-tree`, `story-little-lights` → 2026-12-01).
  Note: the site is statically built — a scheduled item appears on its date for pages already deployed, because visibility is checked in the browser.
- `access_tier`: `"free"` or `"plus"`. Keep roughly 1 in 3 items free.
- `version`: bump when you change an existing item.

## Worksheet templates (`template.kind`)
| kind | params | example |
|---|---|---|
| `color` | `picture` | big outline to colour |
| `dots` | `picture`, `count` (3–12) | finger-paint dabbing circles |
| `trace` | `pattern` (`straight`/`wave`/`zigzag`/`loop`/`steps`), `from`, `to`, `rows` (1–5) | pre-writing lines |
| `match` | `items` (2–4 distinct pictures) | picture → shadow |
| `count` | `picture`, `max` (2–5) | count and circle matching dots |
| `size` | `picture` | big vs small |
| `same` | `target`, `others` (≥2, not the target) | circle the matching one |
| `path` | `from`, `to` | wide winding path |

Pictures: `balloon fish star car ball flower apple duck sun cloud house heart cat tree moon banana`
(add new ones in `apps/web/components/brand/Picture.tsx` + `PICTURE_KINDS` in `packages/game-core/src/library.ts`).

Every worksheet needs: Thai + English title, Thai instruction, `adult_tips`, `words` (TH/EN talk vocabulary), and at least one `safety` note (non-toxic chunky crayons; no small stickers under 3 — choking hazard).

## Stories
- 3–16 pages; **every page needs both `th` and `en`** (validator enforces).
- `scene.bg`: `day | night | garden | rain | home | sea`; `scene.cast`: `["lilo"]`, `["grow","lilo"]`; optional `scene.item` (a picture).
- `questions`: talk-together prompts after reading.
- `audio.th` / `audio.en`: path to a licensed recording (e.g. `/audio/story-x-th.mp3` in `apps/web/public/audio/`). `null` → device speech synthesis (temporary).
- `author`: provenance. Only original or properly licensed text — never copy published picture books.

## Check before pushing
```bash
pnpm test        # validators reject missing translations, unknown pictures, bad params, duplicate ids
pnpm build
```
## Review checklist (PRD §10)
Thai wording reviewed by a Thai early-years educator · English reviewed by an English educator · safety notes present · age tags realistic for 1–2 vs 2–3.
