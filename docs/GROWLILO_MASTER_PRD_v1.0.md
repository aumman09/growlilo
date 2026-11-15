# GROWLILO — MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD)

> **Version:** 1.0 — 15 November 2026  
> **Status:** Product specification for implementation; not a claim that features already exist  
> **Language:** Thai-first; architecture prepared for multilingual support  
> **Product:** Growlilo — *Play. Learn. Grow Together.*  
> **Tagline (TH):** เล่นด้วยกัน เรียนรู้ไปด้วยกัน  
> **Primary delivery:** Responsive website + installable Progressive Web App (PWA)  
> **Target market:** Thai parents and families; initial child learning focus ages 4–8; long-term vision ages 2–12

---

## 0. READ THIS FIRST — คำสั่งสำหรับ AI / ทีมพัฒนา

เอกสารนี้เป็น **source of truth** สำหรับระบบ Growlilo ฉบับเริ่มพัฒนาจริง ไม่ใช่คำบรรยายเพื่อทำภาพ mockup เท่านั้น ทุกข้อที่ระบุว่า MUST ใน MVP ต้องมี interaction, state persistence, validation, error state, accessibility และการทดสอบตาม acceptance criteria

1. **อย่าเริ่มสร้าง 6 วิชาครบ 4 ช่วงวัยทันที**: สถาปัตยกรรมต้องรองรับ 2–12 ปี แต่ MVP เนื้อหาลึกเน้น 4–8 ปี (English / Thai / Math) และเกม 3 engines ที่นำกลับมาใช้ซ้ำ
2. **ต้องมี 2 surfaces:** (A) marketing landing website แบบ scroll ลงหน้าเดียวมี motion และ conversion; (B) child-safe PWA + parent area + admin CMS; ใช้ design system เดียวกัน แต่ UX แยกตาม audience
3. **เกมต้องเล่นได้จริง:** อย่าทำปุ่มหลอก/หน้าว่าง/ข้อมูลสาธิตที่ทำตัวเหมือน production; กรณีข้อมูล demo ต้องระบุ Demo อย่างชัดเจน
4. **ความปลอดภัยต้องมีตั้งแต่แรก:** child area ไม่มีโฆษณา, external links, direct purchase, open chat, social feed, public leaderboard, engagement streak, autoplay ด่านไม่สิ้นสุด หรือการชวนให้เด็กใช้จอนานขึ้น
5. **ไม่มี AI chat กับเด็ก** ใน MVP; เลือกกิจกรรมจาก curated content ผ่าน deterministic rules ก่อน
6. **หลักฐานจริงก่อนอ้างผล:** ห้ามอ้างว่าป้องกันการติดจอได้ ห้ามสรุปว่าฝึกแล้วฉลาดขึ้น/พัฒนาการดีขึ้นโดยไม่มีการทดสอบ; Progress คือผลการทำกิจกรรม ไม่ใช่การวินิจฉัย
7. **การเก็บข้อมูลเด็กแบบ minimal:** ไม่บังคับใช้ชื่อจริง รูปภาพ ไมค์ กล้อง ตำแหน่ง หรือวันเกิดเต็ม; ผู้ปกครองเป็นผู้จัดการข้อมูลและสิทธิ์
8. **ยึด theme Growlilo ที่ตกลงกัน:** ฟีลพาสเทลเขียว ครีม ส้ม ฟ้า; มาสคอตต้นอ่อน / explorer / คู่พ่อแม่ลูกจาก concept ที่สร้างไว้; ห้ามใช้สื่อจากลิงก์ที่เข้าถึงไม่ได้เป็น asset โดยไม่ได้รับไฟล์
9. **ทุกเฟสต้องรันได้:** ติดตั้ง dependencies → start → test ผ่าน → deploy preview; ห้ามประกาศว่าเสร็จจากการสร้างโค้ดอย่างเดียว
10. **ถามเฉพาะ blocker จริง**; หากไม่มีคำตอบให้ใช้ defaults ในเอกสารนี้และบันทึก assumptions ใน `DECISIONS.md`

### Definition of Done
- เปิดผ่าน HTTPS บนมือถือจริงได้; ใช้ PWA manifest/icon/service worker; offline พื้นฐานทำงานหลังโหลดข้อมูลแล้ว
- มี end-to-end flow: Landing → Start free → Parent onboarding → Child profile → Daily plan → Play mini game → Screen break → Offline family mission → Parent confirmation → Progress → Parent upsell/checkout (sandbox)
- ใช้ข้อมูลจริงผ่าน app state/database (ไม่ใช่ static mock cards); backoffice เพิ่ม/edit บทเรียนได้โดยไม่แก้ source code ในระยะ CMS
- ผ่าน automated lint/typecheck/unit tests + integration + manual mobile QA + security/privacy review

---

## 1. Vision / Positioning / JTBD

**Vision:** ให้ครอบครัวไทยสร้างความสัมพันธ์ผ่านการเล่นและการเรียนรู้ โดยใช้จอเป็นจุดเริ่มต้น ไม่ใช่จุดหมาย

**Positioning:** Growlilo is a parent-assisted learning companion, not an endless kids game catalog.

**Core promise:** “มีเวลาให้ลูก 15 นาที? Growlilo จัดกิจกรรมที่สนุก มีสาระ และต่อยอดสู่นอกจอให้”

**3 product pillars:**
- **Learn:** ภาษาอังกฤษ ภาษาไทย คณิตศาสตร์ เป็น entry-point; ต่อไปวิทยาศาสตร์ การคิด ทักษะชีวิต
- **Play Together:** สคริปต์/ภารกิจพ่อแม่ลูกที่ใช้สิ่งของในบ้าน ลดภาระเตรียมอุปกรณ์
- **Grow Mindfully:** เรียนสั้น ๆ จบอย่างนุ่มนวล ดูความคืบหน้าโดยไม่วัดคุณค่าของเด็กเป็นคะแนนแข่งขัน

**Jobs to be done:**
- พ่อแม่: “วันนี้ฉันมีเวลาไม่มาก อยากทำกิจกรรมกับลูกแต่คิดไม่ออก”
- พ่อแม่: “ฉันไม่เก่งภาษาอังกฤษ แต่ต้องการชวนลูกฝึกคำศัพท์ด้วยกัน”
- พ่อแม่: “อยากเห็นว่าลูกลองอะไรและพัฒนาจากกิจกรรมไหน โดยไม่กดดัน”
- เด็ก: “อยากเล่นเกมน่ารักที่ฉันเลือก/ตอบเองได้ และมีช่วงได้ทำอะไรจริงกับผู้ใหญ่”

**Differentiation / moat:** quality curated Thai-first curriculum, family experience design, well-crafted mascot/story world, parent trust, reliable activity recommendation, continual evidence-driven content improvement. เกม ABC/สี/จับคู่และ AI generator เพียงอย่างเดียว **ไม่ใช่ moat**.

---

## 2. Users, Age Bands, Permissions

| Persona | Goals | Device | Notes |
|---|---|---|---|
| Parent / guardian | เลือกบทเรียน ตั้งเวลา ชำระเงิน ดูกิจกรรม | Phone, tablet, laptop | Account owner; gate to adult zone |
| Child 2–3 (future parent-assisted mode) | เสียง/ภาพสั้นร่วมกับผู้ใหญ่ | Tablet/phone shared | ไม่ออกแบบให้เด็กอยู่กับจอลำพัง; อายุนี้ไม่ใช่ MVP focus |
| Child 4–5 | สี รูปทรง counting, alphabet, listening | Tablet/phone | ปุ่มใหญ่ เสียง/ภาพมากกว่าข้อความ |
| Child 6–8 | phonics, spelling, Thai literacy, math | Tablet/phone | difficulty adapt ภายใต้กฎ curated |
| Child 9–12 (future) | logic, science, conversations, comprehension | Tablet/desktop | visual theme ต้องไม่ดูเด็กทารก |
| Content editor / educator | เพิ่มบทเรียน ตรวจเสียง/ผลลัพธ์ | Desktop | Role-based CMS |
| Customer support / admin | ดู billing/support/audit | Desktop | ไม่มีสิทธิ์เข้าข้อมูลเด็กเกินจำเป็น |

**Role/permissions:** `visitor`, `parent`, `child_local_profile`, `editor`, `admin`. Child profile ไม่ใช่ auth account ไม่สามารถเข้าการซื้อหรือ admin. ใช้การระบุตัวตนผู้ปกครองที่เหมาะสม ไม่ใช่เพียงปุ่ม “ฉันเป็นผู้ใหญ่”; parent gate เป็น usability barrier และแยกจากการยืนยันตัวตน/consent ตามกฎหมาย.

---

## 3. Product Surfaces and Navigation

### 3.1 Public website (marketing + SEO)
- `/` landing page แบบ scroll storytelling, animations อย่างพอดี, desktop-first quality + responsive mobile
- `/how-it-works` (optional SEO detail; landing sections link via anchors)
- `/activities` ตัวอย่างภารกิจและ learning categories (ไม่เผยเนื้อหาพรีเมียมทั้งหมด)
- `/pricing` แพ็กและคำถามการชำระเงิน
- `/about`, `/contact`, `/privacy`, `/terms`, `/refunds`, `/parent-guide`
- CTAs: `ลองเล่นฟรี` → `/app/welcome`; `ดูตัวอย่างกิจกรรม`; `ดูแพ็กครอบครัว`

### 3.2 Authenticated parent + child PWA
- `/app/welcome` → parent consent/onboarding
- `/app/select-child` เลือกโปรไฟล์แบบ local nickname/avatar
- `/app/home` หน้าเด็ก (daily journey, 3 subject entrances, mascot)
- `/app/lesson/:id` intro → mini game → feedback → graceful end
- `/app/mission/:id` card ภารกิจนอกจอ; child sees simplified safe instruction, parent confirms from gate
- `/app/break` default completion state, no infinite next-level prompt
- `/app/parent` dashboard with daily plan, progress, profiles, screen-time settings
- `/app/parent/family` activities & printable assets
- `/app/parent/billing` plan, checkout, manage/cancel
- `/app/parent/settings` privacy, export/delete, language, accessibility

### 3.3 Admin CMS
- `/studio` protected via RBAC; games, lessons, missions, audio, age tagging, publish/unpublish, change audit, preview
- Basic subscription/support dashboard; no surveillance-style child analytics

---

## 4. UX/UI Redesign — เรียบหรู อบอุ่น และดูน่าซื้อ

### 4.1 Overall art direction
**Style:** “Premium playful / Nordic-inspired editorial + illustrated warm learning world.” ไม่เอา dashboard ธุรกิจทึบ ๆ หรือปุ่มลูกกวาดเต็มจอ. ใช้ generous whitespace, soft depth, editorial typography, restrained gradients, tasteful mascot motion, clear hierarchy.

**Brand colors (suggested tokens; verify contrast):**
- `forest-900 #234B37` text headings, primary CTA
- `forest-700 #357553` brand emphasis
- `leaf-500 #7CB66B` illustration
- `cream-50 #FFF9EE` background
- `cream-100 #F6F0E3` muted surface
- `peach-400 #F7A363` warm active
- `blue-300 #9ED4F2` learning highlight
- `ink-900 #26382F` body
- `muted #69786E` secondary text
- `error #B44337`, `success #286E49`

**Type:** `Noto Sans Thai` or Thai-friendly licensed type family for body, rounded display Latin (`Nunito` or comparable) for headings; self-host/subset legally. Typography scale on mobile 14–16 body, 30–40 display; desktop hero up to 64–80 px. No unreadable text on images.

**Spacing & shape:** 8px scale; 18–28px radius for cards, 999px pills; buttons 48–56px min height, touch targets ≥44x44px, clear focus states. Shadows subtle not overdone.

**Motion:** 150–350ms gentle transitions; hero mascot float 3–5s; scroll reveal once, parallax minimal. Support `prefers-reduced-motion`, avoid flashing/strobe, avoid movement that distracts child.

**Mascot kit:** lock brand master and derive expression sheet; modes: Read, Explore, Hug/Together. Keep face/leaf proportions consistent, responsive app icon crop. Art direction: original, soft and coherent. All assets require provenance/license.

### 4.2 Audience-specific visual language
- **Marketing:** high polish, real family benefits, photography/illustration with genuine diversity and accessibility; no fabricated testimonials or deceptive statistics. Trust sections, transparent pricing, real screenshots.
- **Child:** 1 main action per screen, prominent icons, spoken instructions, no microtext, minimal navigation, big choices, positive feedback without addictive reward loops. Select scenes free of ads / outbound links.
- **Parent:** calm information architecture and quick actions, confidence in privacy; show learning evidence and next activities, not leaderboard or diagnostic scores.

### 4.3 Mobile responsive behavior
Breakpoints: 320, 360, 390, 430, 768, 1024, 1440; safe-area support, portrait priority but tablet landscape usable; game canvas scale-preserving without cut-off; icon/text readability on low-end Android; sticky bottom CTA on marketing only, bottom app navigation in parent mode only, no marketing CTA inside child game.

### 4.4 Design deliverables
Figma or equivalent: tokens, typography, buttons, form fields, cards, dialogs, game HUD, skeleton, empty/error/offline states, adaptive layouts, icon system, mascot variants, landing design (mobile+desktop), full interaction prototype. Capture screen PNGs for QA.

---

## 5. Marketing Landing Page — หน้าเว็บแบบเลื่อนลงที่พ่อแม่เห็นแล้วอยากลอง

**Conversion goal:** Family visits → meaningful free lesson started; later paid checkout. Secondary: leads/waitlist and educator inquiries.

### 5.1 Section-by-section storyboard (desktop/mobile)

| Order | Section | Content & UX | CTA |
|---|---|---|---|
| 01 | Navbar | Logo `growlilo.` left; วิธีใช้งาน / เรียนอะไร / สำหรับพ่อแม่ / ราคา / FAQ; sticky, mobile drawer | ลองเล่นฟรี |
| 02 | Hero (above fold) | Oversized headline **“เวลาสั้น ๆ ที่ได้ใกล้ชิดกันมากขึ้น”**; subhead “เกมเรียนรู้สั้น ๆ แล้วชวนพ่อแม่ลูกออกไปเล่นในโลกจริง”; 3D-ish 2D illustration of parent+child mascots with smartphone card; real product demo preview | ลองเล่นฟรี / ดูวิธีทำงาน |
| 03 | Social proof (honest) | “ออกแบบเพื่อ…” (no fake stats). Insert real quotes/logos ONLY when documented | ดูตัวอย่าง |
| 04 | Problem → solution | พ่อแม่เหนื่อย/คิดกิจกรรมไม่ออก/กังวลจอ → 3 promises: พร้อมเล่น, นอกจอ, เห็นการเรียนรู้ | เริ่มที่บ้าน |
| 05 | Scroll story: 3 steps | ① เกมสั้น ② ภารกิจพ่อแม่ลูก ③ ก้าวถัดไป; alternating illustration/screenshots; animations on scroll | ดูเกมตัวอย่าง |
| 06 | Interactive daily planner teaser | Age/time/interest filters → sample 15-min plan; execute logic locally; label 'ตัวอย่างแผน' | ทดลองแผนกิจกรรม |
| 07 | Learning worlds | 6 cards: English, Thai, Math (MVP); Science, Thinking, Life Skills (Coming later badge in marketing, not false availability) | ดูบทเรียน |
| 08 | Spotlight English Together | Parent who doesn't speak English can play together via pronunciations, Thai prompts; show 'Apple', listening, everyday phrases | เล่นภาษาอังกฤษฟรี |
| 09 | Together moments | Offline missions, family-friendly, meaningful parent-child connection; sample photo-free journaling; 3 real-world scenarios | รับไอเดียกิจกรรม |
| 10 | Parent Dashboard preview | Daily summary, safe limits, growth journey. Avoid developmental diagnosis claims | ดูระบบผู้ปกครอง |
| 11 | Pricing | Free and Family Plus (launch assumption 99 THB/mo, optionally 899 THB/yr subject to tests), transparency on cancellation, what's included | เริ่มฟรี / เลือกแพ็ก |
| 12 | Trust & privacy | No ads to kids, parent-controlled purchases, no open chats, child data minimized; linked full privacy page | อ่านนโยบาย |
| 13 | FAQ | age, screen-time, install PWA, offline, payments, devices, how family activity works | ลองเล่นฟรี |
| 14 | Final CTA | Parent/child mascot together, warm gradient “วันนี้เริ่มก้าวเล็ก ๆ ด้วยกัน” | เริ่มเล่นฟรี |
| 15 | Footer | contact, social, policy, help, educator, © | — |

### 5.2 Landing interactive requirements
- Every CTA has an intentional destination; no dead ends. Demo clip/video may be placeholder **only in staging and explicitly labeled**.
- Daily planner teaser produces valid plan for 4–5 and 6–8; if 2–3 selected show parent-assisted guidance instead of default screen duration; 9–12 explain roadmap if not supported in MVP.
- FAQ accordion keyboard operable; pricing switch uses real plan values from config; respects sale availability.
- Scroll animation must not gate information or make reduced-motion unusable.
- Social proof/testimonials **only actual consented feedback**, no generated fake photos/quotes as proof.
- SEO: Thai title, meta description, canonical, `og:image`, `og:title`, JSON-LD for organization/software where accurate, sitemap, robots, semantic H1-H3.
- Marketing analytics only privacy-respecting aggregated events; avoid child tracking, ad personalization, or pixel scripts in child app.
- Lighthouse targets (budget): Performance ≥85 mobile under realistic conditions; Accessibility ≥95; SEO ≥90 (not guarantee across devices). Core Web Vitals monitored.

### 5.3 Proposed copy
- Hero H1: **“เล่นด้วยกัน เรียนรู้ไปด้วยกัน”**
- Hero subhead: “Growlilo ช่วยพ่อแม่เปลี่ยนเวลาสั้น ๆ ให้เป็นเกมเรียนรู้และกิจกรรมสนุกที่ทำกับลูกได้จริง”
- Hero CTA: **“ลองกิจกรรมฟรี”**
- Secondary CTA: **“ดูวิธีเล่น 3 ขั้นตอน”**
- Value callout: “ไม่ต้องคิดเกมเอง • ไม่ต้องเตรียมของเยอะ • จบจอแล้วไปเล่นจริง” (qualified when true)
- Closing: “วันนี้ไม่รู้จะเล่นอะไรกับลูก? เริ่มด้วยก้าวเล็ก ๆ ที่ Growlilo”

---

## 6. Child App Flows — เกมสนุกและใช้งานได้จริง

### 6.1 Onboarding (parent-led)
1. From landing `ลองเล่นฟรี` → introductory parent setup.
2. Explain purpose, minimal data, privacy and optional account.
3. Ask child **age band**, not exact birth date; nickname optional and stored local; select avatar (curated); default content language Thai.
4. Choose family time window (10/15/20/30 minutes total activity, NOT necessarily all screen time). Set **screen segment** separately (e.g. short 3–5 min) with a parent-configured safe upper bound. Avoid implying 10–30 minutes of screen for toddler.
5. Start suggested Daily plan; child mode begins after parent setting.

### 6.2 Home
- Mascot greets child without manipulating urgency; `วันนี้เราจะเล่นอะไรดี?`
- One prominent recommended quest; 3 learning worlds in MVP; `เล่นกับพ่อแม่` shortcut.
- Adult-zone gate icon discreet, clear parental transition.
- Offline state chip if disconnected; cached lessons still playable.

### 6.3 Core mini-game engines (MVP)

**Engine G1 — Match / Drag-and-Drop**
- Match picture-to-picture, word-to-picture, sound-to-picture. Pointer/tap accessibility (don't require precise drag); no punitive countdown; replay audio.
- Acceptance: choose correct item, immediate positive explanation; wrong answer supportive retry + optional hint; stored outcome; keyboard alternative for web.

**Engine G2 — Counting & Number Choice**
- Count real-looking simple objects, select number / add one / subtraction according to age. Ensure number of assets matches solution and no ambiguous choices.
- Acceptance: age-appropriate question bank, deterministic randomization seed for reproducible tests, progress saved, final summary.

**Engine G3 — Letter / Word Building**
- Thai letter-image and English letter/phonics/word puzzle using configurable tiles and audio. English phonics content educationally reviewed; Thai spelling content reviewed.
- Acceptance: correct order matching normalized answer, audio accessible, phonics mappings not generated unchecked.

**Shared lesson engine requirements**
- `intro → activity[1..N] → feedback → completion → break/mission`.
- Lessons are 3–5 minutes as configurable default; stop naturally on completion, no automatic next game, no leaderboards/streaks/loot.
- Audio with pause/mute/replay, captions/visual alternative, animation-reduced option.
- Each attempt saves completion, question counts, subject, skill IDs, hints used (only necessary fields), no raw voice/image capture.
- Free lesson can be repeated without time-pressure upsell shown to child.

### 6.4 Content map / roadmap

| Age | MVP? | English | Thai | Math | Other worlds |
|---|---|---|---|---|---|
| 2–3 | Later: parent-assisted | sound/picture prompts with parent | nursery/listening | colors/sorting with objects | family-assisted; avoid solo screen |
| 4–5 | **YES** | 26 letters intro, listening, common nouns | ก–ฮ introductory sound/picture | 1–10, colors, shapes | logic and family missions |
| 6–8 | **YES** | phonics foundations, simple words, basic sentences | reading/spelling intro | number sense, addition/subtraction | puzzles and life skills |
| 9–12 | Later | short conversations/reading | reading comprehension | multi-step problems | science/reasoning |

**MVP content target:** 3 engines; around 20–30 curated lessons distributed across ages 4–5 and 6–8, ~30+ family missions, at least 10 English Together parent scripts. Counts are planning targets; publish quality over quantity.

### 6.5 English Together module (must ship in MVP)
- Vocabulary packs e.g. Animals, Colors, Food, Home, Family; word, phonetic-quality native audio (licensed/reviewed), Thai help for parents, example parent-child phrase, related offline quest.
- Example: `Find something red` → parent helps child find red item (not a requirement to upload photo).
- Speech recognition/AI pronunciation feedback **NOT in MVP**; no microphone capture by default. Optional recording feature requires later legal/security/content review.

---

## 7. Signature System — Daily Plan + Grow Together + Progress

### 7.1 Daily Activity Plan (paid driver)
Inputs: age band, available **total family time**, topic focus, location (home/indoors/outdoors as user-selected non-geolocation), materials availability, previously completed skill IDs. Outputs: a safe plan with screen portion + offline mission + conversation prompt.

**Initial deterministic algorithm:** Filter published content by age band, skill, materials, duration, safety; avoid recent repetition; select 1 mini-game + 1 mission + 1 reflective prompt. Validate total estimated time; respect screen cap. Fallback to general activity when no match. Do not claim AI personalization.

Example 15-minute family plan (ages 4–8): 5 min screen game + 7 min offscreen exploration + 3 min conversation. For 2–3 parent-assisted pilot, default to offline-first and child screen guidance rather than same 5-min plan automatically.

**Daily is optional**: No streak pressure, notifications about missed days, penalties, guilt language, or scarcity manipulation.

### 7.2 Grow Together Missions
Each mission has title, age band, instructions for child (short/illustrated), instructions for adult, max prep, materials, duration, what skill it reinforces, safety warnings, variations, completion question `วันนี้สนุกกับอะไร?` Parent must confirm completion in adult area; no surveillance data.

Sample missions:
- English/Colors: Find three blue objects and say `blue` together
- Math: Count spoons and cups while setting the table
- Thai: Find ก initial sound in simple familiar picture/word cards
- Life skill: Choose a feeling face and share one good thing today
- Science (later): Observe shadow outdoors with adult supervision, avoid unsafe experiments

### 7.3 Growth Journey (parent dashboard)
- Weekly summary: lessons attempted, skills practiced, missions parent-confirmed, next gentle suggestion.
- Skill confidence from **task outcomes within app only**, labels e.g. “กำลังฝึก / ทำได้ในกิจกรรมนี้ / ลองอีกครั้ง”; not intelligence level or developmental diagnosis.
- Progress graph no comparisons to other children; no public social rankings.
- Parents may delete records or local profile; future cloud export support.

### 7.4 Screen Break & habit design
- Timer is a safeguard not a paywall; available free.
- Warn adult before end, naturally finish the active short activity; child-friendly completion animation; suggest non-screen next step; parental override adult-gated and logged for settings (not child behavioral score).
- Never encourage more screen time as an upsell.

---

## 8. Free vs Family Plus / Commercial

### 8.1 Plans (hypotheses, not validated market pricing)
- **Free forever**: selected lessons for English/Thai/Math, sample family missions, basic progress, manual parental limits, no ads, privacy baseline.
- **Family Plus — initial A/B test price hypothesis:** **99 THB/month**; potential annual **899 THB/year** after validation. Includes full curated library, personalized rules-based daily plans, expanded progress summaries, printable PDFs and multiple child profiles. Avoid paywalling screen limits or child safety.
- **Single packs (Phase 2):** English/Phonics or family activity packs, one-time. Need clear entitlement policy.
- **School licensing (Phase 3):** pilot quote, classroom use and teacher tools, separate data governance; not fake-ready at launch.

### 8.2 Checkout and payment
- PWA independent website: charge adult-only via licensed payment gateway supporting Thailand; evaluate PromptPay for manual renewals and cards for auto-recurring plans. **PromptPay QR payment does not imply automatic monthly recurrence.**
- Never place checkout link / price banners in child mode; adult auth / gate.
- Server creates payment intent/checkout session; verify signed webhook, idempotency, amount/currency/plan/status; update `entitlement`; send confirmation; handle expiry, refunds, cancellation, disputes.
- No hardcoded pricing in client; store plan catalog server-side and show taxes/fees/cancellation clearly.
- Sandbox integration must be functioning before production payment; legal/accounting review and merchant onboarding required.
- If later published via app stores, re-evaluate app-store payment rules; web payment freedom does not automatically carry over inside wrapped store apps.

### 8.3 Revenue assumptions & budget
**PWA self-build estimate (planning, not quotation):** Prototype 3,000–10,000 THB; MVP 15,000–45,000 THB excluding developer time and expensive custom art/content. Monthly ongoing: hosting 0–2,000, tools 0–3,000, marketing as budgeted, payment processing variable. Commercial app can exceed significantly.

**Unit economics model:**
`monthly gross = active paying monthly members × monthly price + one-time pack revenue + annual cash receipts + school receipts`.
`net after processing = gross − transaction fees − refunds − VAT/tax handling − chargebacks`.
`operating contribution = net after processing − hosting − content/voice cost − support − acquisition spend − staff costs`.
Annual cash receipts must not be confused with recurring monthly recognized revenue. Test pricing with actual checkout/preorders, not only surveys.

---

## 9. Parent Dashboard (MVP)

### Widgets
- Today’s family plan card; resume/start
- Child selector (one profile in initial free, multiple on Plus if validated)
- Activities done this week (on-device), subject breakdown, family missions completed
- “Try next” with reasoning (e.g., several listening activities done → new words)
- Time settings (available to all)
- Parent language help (English prompts with Thai meaning)
- Privacy controls + export/delete (for local data in MVP; cloud on Phase 2)
- Billing separated from child area, renewal terms, self-serve cancel

### Edge cases
- no activity yet / no internet / offline record unsynced / expired Plus / refund / multiple devices conflict / parent forgot password / child wants exit / wrong age setting
- No promise that progress is clinical developmental assessment.

---

## 10. Admin CMS / Content Production

### Content schema
All lessons and activities must be **data-driven** (JSON/database) with stable IDs, versions, localization keys, media references, skill taxonomy, age applicability, access tier, status, review audit.

**Lesson object sample:**
```json
{
  "id": "en-colors-match-001",
  "version": 1,
  "status": "published",
  "subject": "english",
  "age_bands": ["4-5"],
  "engine": "match",
  "title": {"th": "จับคู่สีสนุก", "en": "Match Colors"},
  "duration_screen_seconds": 240,
  "skill_ids": ["en.colors.basic", "cognition.visual_match"],
  "items": [
    {"id":"red","prompt_audio":"audio/en/red.mp3","correct_media":"images/red_ball.webp","choice_media":["images/red_ball.webp","images/blue_ball.webp"]}
  ],
  "linked_mission_id": "mission-find-red-001",
  "access_tier": "free",
  "reviewed_by": "educator_role",
  "safety_reviewed": true
}
```

### CMS workflow
`draft → content review → linguistic review → safety/accessibility review → staging preview → publish → version history`. Content cannot publish without approved reviewer; easy rollback. Uploaded assets scanned, size-restricted, privately tracked; no untrusted HTML injection.

### Content standards
English phonics reviewed by qualified English educator, Thai literacy reviewed by Thai educator, math developmentally appropriate. Adult missions include safety notes; no small choking objects for younger ages, no risky chemical/heat activities. Audio transcripts available. Keep source licenses.

---

## 11. Recommended Tech Stack & Architecture

### 11.1 Stack
- `pnpm` monorepo; TypeScript everywhere front end
- **Web:** Next.js (App Router) for SEO landing, marketing and parent flows; React client components for app; Tailwind CSS + accessible headless component primitives; CSS motion or Framer Motion with reduced-motion support
- **Mini games:** Phaser 3 embedded only for game routes when needed; simple quiz UI can be native React if more accessible
- **PWA:** web app manifest, versioned service worker with Workbox/appropriate plugin, install icons 192/512 and maskable, offline fallback, cache strategy excluding auth/PII
- **Backend:** FastAPI (Python) for business logic and content APIs; PostgreSQL for accounts/plans/content, object storage for licensed assets, Redis optional later
- **Auth:** parent email magic link / secure OAuth provider; sessions via secure HttpOnly cookies, CSRF protection, rate limiting. Child profiles linked to parent; no independent children login
- **Payments:** provider hosted checkout & webhooks, environment-based sandbox/production
- **Deployment:** HTTPS CDN host for web + server API + managed Postgres, secrets through environment manager; staging and production separate
- **Analytics:** privacy-respecting aggregated *parent/marketing funnel only*; no cross-site ad trackers in child PWA

If using Next.js and FastAPI is too complex for sole developer during Prototype, use Vite+React+Phaser+localStorage first, but maintain architecture migration path to production. Never treat prototype storage as secure production identity/billing.

### 11.2 Suggested monorepo tree
```text
growlilo/
├── apps/
│   ├── web/                    # Landing + parent web/PWA
│   │   ├── app/(marketing)/    # Home, pricing, legal, FAQ
│   │   ├── app/app/            # Child + parent routes
│   │   ├── components/
│   │   ├── games/              # Phaser scene adapters
│   │   ├── public/icons/
│   │   ├── public/manifest.webmanifest
│   │   └── styles/
│   ├── api/                    # FastAPI
│   │   ├── app/routers/
│   │   ├── app/services/
│   │   ├── app/models/
│   │   ├── app/security/
│   │   └── tests/
│   └── studio/                 # Admin CMS (can be route group in web)
├── packages/
│   ├── design-tokens/
│   ├── game-core/
│   ├── content-schemas/
│   └── shared-types/
├── content/                    # curated seeded data
├── assets/                     # original artwork and licenses
├── infra/                      # deploy and config
├── docs/                       # PRD, architecture, decisions
└── .github/workflows/          # CI
```

### 11.3 Database entities (Phase 2 production-ready)
- `parents(id, email, locale, created_at, deleted_at)`
- `child_profiles(id, parent_id, nickname_optional, age_band, avatar_id, settings_json, created_at)`
- `subjects(id, slug, visibility)`
- `skills(id, subject_id, age_band, name)`
- `lessons(id, engine, version, age_bands, skill_ids, tier, duration, status, content_json)`
- `missions(id, version, age_bands, required_materials, safety_notes, content_json, tier)`
- `lesson_attempts(id, child_profile_id, lesson_id, created_at, completion, correct_count, attempted_count, hints_used)`
- `mission_completions(id, child_profile_id, mission_id, confirmed_by_parent_at, reflection_optional)`
- `daily_plans(id, child_profile_id, day, plan_json, plan_version)`
- `plans(id, sku, price_minor_units, currency, interval, active)`
- `subscriptions(id, parent_id, plan_id, provider, external_id, status, current_period_end)`
- `payments(id, parent_id, provider_reference, amount_minor_units, currency, status, idempotency_key)`
- `entitlements(id, parent_id, product_id, valid_from, valid_to, source_payment_id)`
- `consents(id, parent_id, purpose, policy_version, agreed_at, revoked_at)`
- `content_reviews(id, content_type, object_id, version, reviewer_id, status, comments)`
- `admin_audit_logs(id, actor, action, entity, timestamp)`

**Do not collect:** exact birth date, location coordinates, school, child name, full parent-child photos, microphones, child device identifiers, unless explicit later approved requirement plus risk/legal basis.

### 11.4 API endpoints (versioned, indicative)
```text
GET    /api/v1/public/plans
GET    /api/v1/public/featured-lessons
POST   /api/v1/auth/start
POST   /api/v1/auth/verify
GET    /api/v1/me
POST   /api/v1/children
GET    /api/v1/children
PATCH  /api/v1/children/{id}
DELETE /api/v1/children/{id}
GET    /api/v1/lessons?age_band=&subject=
GET    /api/v1/lessons/{id}
POST   /api/v1/attempts
POST   /api/v1/daily-plans/generate
GET    /api/v1/missions/{id}
POST   /api/v1/mission-completions
GET    /api/v1/progress/{child_id}
POST   /api/v1/checkout/sessions
POST   /api/v1/webhooks/payment-provider
GET    /api/v1/billing/subscription
POST   /api/v1/billing/cancel
GET    /api/v1/me/export
DELETE /api/v1/me
# ADMIN (RBAC)
GET/POST/PATCH /api/v1/admin/lessons
GET/POST/PATCH /api/v1/admin/missions
POST /api/v1/admin/lessons/{id}/publish
```

**API contract standards:** OpenAPI generated, typed SDK, request/response schemas, authorization on server, idempotent writes on checkout, pagination, error codes, localized friendly error messages.

### 11.5 Offline & syncing
- Installability from secure HTTPS, manifest and icons; service worker caches app shell, game assets and selected lessons intentionally.
- **Never cache payment responses, parent private endpoints, or auth tokens in public cache**.
- Progress local via IndexedDB; on login optional sync by parent with conflict resolution (append attempts and dedup IDs) and secure policy.
- Show `offline` status; checkout requires internet; if no saved lesson, show fallback screen with offline family activities already cached.
- PWA storage can be evicted by OS/browser; expose a realistic notice and optional sync/backup.

---

## 12. Security, Privacy, Legal, Accessibility

### Safety requirements
- Parental area protected through verified adult session and extra gate before purchases/links; child PWA contains no purchase controls or ads.
- No public child profiles, chat, user-generated uploads, behavioral advertising, third-party pixels in child experience.
- Minimum necessary personal data, retention limits, deletion/export functions, privacy impact review before launch.
- Follow Thai PDPA and legal advice for lawful basis, parental authorization and under-10 consent requirements when consent is used; distinguish consent from age-gate.
- Later app-store deployment needs separate Apple Kids Category/Google Families Policy review. PWA alone does not remove child privacy responsibilities.
- CSP, HTTPS, HSTS, secure cookies, OWASP checks, dependency scanning, input validation, CDN abuse limits, backups, monitoring.
- Content accessibility: clear contrast, keyboard alternatives to dragging, captions and replay, large touch targets, reduced-motion, screen readers in parent pages, audio descriptions where practical.

### Legal documents before accepting payment
`Privacy Policy`, `Terms of Service`, `Refund/Cancellation`, `Cookie/Analytics notice` if applicable, `Parental Consent & Data Rights`, `Contact/Support`, transaction invoice/tax handling. Legal/accounting review required; templates alone are not sufficient compliance.

### PWA-specific verification
Install prompts and platform capabilities vary across Android, iOS and browsers. iOS home-screen install may require share menu; do not promise native-app parity. Use MDN PWA documentation and browser testing. All production features have fallback if install not available.

---

## 13. Analytics & Learning Measurement

**Allowed marketing/parent funnel metrics (privacy respecting):** landing CTA clicks, parent registration completion, adult demo start, active paying families, payment conversion, cancellation, support tickets, successful family missions (if collected with parent opt-in), offline usage reliability.

**Do not optimize for:** child's session length, repeated autoplay, addictive rewards, retention streaks, child-level advertising segmentation.

**North-star metric candidate:** `families completing at least 1 parent-confirmed offline activity in a week` with consent and quality caveats; not a substitute for actual learning assessment.

**Experiment:** 20–30 parent families for alpha, 1–2 weeks. Interviews, observation with consent, ability to finish game, parent ability to end screen, activity actual completion; 5/30 paid conversions is a **testing hypothesis**, not forecast.

---

## 14. Roadmap & Release Gates

### Phase 0 — Brand & product discovery (1–2 weeks target)
- Confirm brand legal availability & domain before final purchase; master mascot variant, design tokens, target 4–8, content curriculum rubric, wireflows.
- Deliverable: Figma flows + 3 game specs + landing mobile/desktop + content sample.
- Gate: 5 parents understand value proposition from landing prototype without explanation.

### Phase 1 — High-quality clickable front end / Playable Alpha (3–5 weeks target)
- Build marketing landing fully responsive and PWA shell; functional 3 engines with seeded examples; local child profile, screen break, offline mission parent confirmation, sample progress; deploy preview over HTTPS.
- No production subscription yet; pricing labelled “planned” if checkout unavailable.
- Gate: test on Android Chrome + iPhone Safari, all flows playable, no dead UI, no critical accessibility issue.

### Phase 2 — MVP / Parent Trial (4–8 weeks target)
- 20–30 lessons, 30 family missions, curated English scripts, deterministic daily plan, parent dashboard, robust privacy terms, local IndexedDB, offline assets; editor tool basic; test family cohort.
- Gate: >80% participants finish an assigned family flow in usability test (goal; validate); no serious safety/security defects; content reviewed.

### Phase 3 — Monetization beta (2–4 weeks target)
- Parent auth/cloud sync, backend, Stripe/Thai gateway sandbox then live, real entitlements, cancel/refund flow, support, analytics.
- Gate: payment scenarios pass (success, fail, webhook retry, refund, cancel, expiry); legal and security sign-off.

### Phase 4 — Growth
- Additional ages 2–3 (parent-assisted, offline-first) and 9–12; science/logic/life skills, expanded story content, school pilot; optional AI content assistance behind educator review; localization and app-store wrapper only after proven demand.

Time windows are planning estimates, not delivery promises; prioritize working tested output over schedules.

---

## 15. Acceptance Criteria — MUST PASS

### Marketing
- [ ] Responsive landing at 320–1440px, no horizontal overflow, performant and accessible
- [ ] Scroll storytelling complete with sections and coherent visuals; reduced-motion works
- [ ] Hero CTAs route to valid free demo and how-it-works anchor
- [ ] Daily planner teaser accepts age/time/topic and displays coherent activities with appropriate toddler warning
- [ ] Pricing transparent, checkout hidden/disabled until real payment available; no fake testimonials
- [ ] SEO metadata, OG image, sitemap, legal links, footer

### App
- [ ] First-time parent can create local profile without child's real name or DOB
- [ ] Child can finish 1 English game, 1 Math game, 1 Thai game; correct/incorrect feedback and audio where available
- [ ] All game results persist after reload within same browser and are scoped by child profile
- [ ] Parent can set screen cap, game ends naturally, break screen shows offscreen mission
- [ ] Child cannot navigate to purchasing or external links without verified adult action
- [ ] Parent can confirm mission; dashboard updates counts and next recommendation
- [ ] Offline loaded games work after reconnect-disabled test; if unavailable, meaningful offline fallback
- [ ] Parent controls and learning report can be understood with no technical training

### Monetization
- [ ] Sandbox checkout creates server-verified entitlement after webhook; tampered client cannot upgrade self
- [ ] Duplicate webhook does not duplicate entitlement or charge record
- [ ] Failed, cancelled, refunded and expired payment statuses handled clearly
- [ ] Adult-only cancel/manage subscription and data deletion paths exist

### Quality
- [ ] Typecheck/lint/unit/integration tests pass in CI; no unhandled runtime errors
- [ ] Browser matrix: Android Chrome, iOS Safari, tablet; keyboard desktop support
- [ ] No third-party trackers in child routes; CSP/security headers; no secrets in client bundle
- [ ] Accessibility labels, contrast checks, reduced motion, touch target checks
- [ ] Copy reviewed for Thai clarity, English pronunciation and age appropriateness

---

## 16. QA Test Scenarios (minimum)

1. Parent visits mobile landing (360px), navigates smooth scroll, clicks free try → app welcome.
2. Parent creates child age 5 avatar; takes one English color lesson with incorrect then correct attempt.
3. Lesson ends, app does not auto-launch next level, shows mission and gentle break.
4. Parent enters gated area; confirms finding red objects; Growth Journey increments.
5. Parent changes 10-minute schedule and re-generates plan; plan time always valid.
6. Offline after initial load: cached lesson plays; sync note explained; checkout blocked.
7. Guest opens parent billing from child route: cannot reach sensitive controls.
8. Multiple siblings: local progress isolated.
9. Refresh and new browser tab: persisted progress consistent.
10. Back/forward navigation in games: no crash/duplication.
11. Very small Android viewport / iOS safe area / landscape tablet: no clipped button.
12. Reduced-motion and keyboard-only flows.
13. Payment webhook forged/duplicate/out-of-order: verify signature, reject and preserve consistency.
14. Parent deletion/export request actually removes/exports account data per scope.
15. Content editor rejects unreviewed lesson publishing.

---

## 17. AI Development Execution Protocol

The implementing AI/agent should work in **vertical slices**, not build every file at once:

1. Create `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/IMPLEMENTATION_PLAN.md` from this PRD. Present architecture and dependencies.
2. Scaffold repo and design tokens; produce marketing responsive page + realistic visual polish and deployable static demo.
3. Implement child home and **one complete English lesson** end-to-end including audio, progress save, screen break and parent mission. Test in actual browser.
4. Generalize lesson engine and add Math/Thai content using reusable schemas; implement Daily plan + dashboard.
5. Add offline PWA behaviors and complete accessibility/device QA.
6. Add parent accounts, API, CMS, and billing sandbox; validate end-to-end.
7. Produce `README.md` setup and deploy instructions, `.env.example` with placeholders, seed script, tests and demo accounts (not real child data), changelog.
8. Before each phase marked done: screenshot test mobile/desktop; run typecheck/lint/tests; record known issues honestly.

**Required result formats:** code repo, runnable preview, screenshots desktop+mobile, test report, API docs, deploy manual, content templates, privacy checklist. Avoid giant code dumps without actual executable project.

**Never:** secretly expose private API keys, use protected characters/assets without license, produce fabricated child progress, fake reviews, auto-generate unsafe learning activities, place checkout into child navigation, claim secure production while using localStorage-only auth.

---

## 18. Open Decisions to Resolve (non-blocking initial defaults)

| Decision | Default | Confirm before |
|---|---|---|
| Brand name legal clearance | Growlilo working name; verify trademark & domains | Public launch/logo registration |
| Mascot hero | Sprout + parent-child pair for landing; explorer alternate | Final illustration asset set |
| MVP target ages | 4–8 years | Content release |
| MVP subjects | English, Thai, Math | Content production |
| Trial subscription | 99 THB/month; 899 annual hypothesis | Paid launch |
| Payment provider | Thailand-supported hosted gateway; start sandbox | Collect real payments |
| Platform | HTTPS PWA, mobile-first; native later | App-store wrapping |
| Default daily family activity | 15 min family total, only ~5 min screen for age 4–8; configurable | Clinical/educator review |
| AI features | None to child; parent rule-based activity planning | Any LLM integration |
| School model | Later | B2B pilot |

---

## 19. Reference Policies / Documentation (verify live before shipping)

- MDN PWA installability: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- MDN PWA offline: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation
- Google Play Families Policy (if later distributed in Play): https://support.google.com/googleplay/android-developer/answer/9893335
- Apple App Review / Kids Category (if later distributed in App Store): https://developer.apple.com/app-store/review/guidelines/
- Thailand PDPA Section 20 (Ministry of Digital Economy and Society unofficial English translation): https://mdes.go.th/law/detail/3577-Personal-Data-Protection-Act-B-E--2562--2019

> This specification is product planning, not legal advice, a clinical efficacy claim, or confirmation of trademark availability. All numbers are proposals to validate with real families and supplier quotes.

---

## 20. One-paragraph build prompt for another AI

> Build **Growlilo**, a Thai-first premium mobile PWA and scrolling conversion-oriented marketing website for parents of children aged 4–8 (future 2–12). Read and follow `GROWLILO_MASTER_PRD_v1.0.md` as the source of truth. Brand style: forest green, warm cream, coral/peach, soft sky blue, original sprout/parent-child mascots, polished clean UI with accessible animations. Build a real runnable app, not mockups: adult onboarding, local child profiles, English/Thai/Math mini-game engines, family daily planner, offscreen Grow Together missions, parent confirmation, screen-time ending, progress dashboard, installable/offline PWA; then build FastAPI/Postgres, admin CMS, secure adult billing in phased milestones. Also implement a modern scrolling landing page with hero, 3-step story, interactive planner teaser, learning worlds, English spotlight, parent proof, pricing, FAQ, legal and CTAs. No advertising in child mode, no open chat, no deceptive growth mechanics; respect privacy and parental controls. Deliver tests, mobile/browser QA evidence, setup, and deployment docs; clearly label features still staged.
