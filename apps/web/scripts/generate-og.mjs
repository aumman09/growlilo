// Renders public/og-image.png (1200x630) from the live landing hero art.
// Usage: serve the built site on :4321 then `node scripts/generate-og.mjs` (needs playwright).
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const out = new URL("../public/og-image.png", import.meta.url).pathname;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto(process.env.OG_URL ?? "http://localhost:4321/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: `
  .nav, .designed, .section, .final, .footer, .sticky-cta, .hero__ctas, .hero__values, .eyebrow { display:none !important }
  .hero { padding: 48px 0 0 !important; height: 630px }
  .hero__grid { grid-template-columns: 1.05fr 1fr !important; gap: 8px !important }
  .hero__title { font-size: 76px !important }
  .hero__sub { font-size: 21px !important }
  .hero__stage { height: 520px !important }
  .container { max-width: 1200px !important; padding: 0 64px !important }
  .og-brand { display:flex; align-items:center; gap:12px; margin-bottom: 8px; font: 800 30px Nunito; color:#234B37 }
  * { animation: none !important }
` });
await p.evaluate(() => {
  const copy = document.querySelector(".hero__copy");
  const d = document.createElement("div");
  d.className = "og-brand";
  d.innerHTML = document.querySelector(".logo").innerHTML;
  copy.prepend(d);
});
await p.waitForTimeout(400);
await p.screenshot({ path: out });
await b.close();
console.log("og-image written");
