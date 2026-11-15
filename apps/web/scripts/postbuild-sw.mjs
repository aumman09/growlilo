// Generates out/sw.js with a versioned precache of the static export (app shell, lesson pages, fonts, icons).
import { createHash } from "crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, relative, sep } from "path";

const OUT = new URL("../out", import.meta.url).pathname;
const SKIP = [/^sw\.js$/, /^(?!app\/).*\.txt$/, /^404/, /^_not-found/, /\.map$/, /^og-image\.png$/, /^robots\.txt$/, /^sitemap\.xml$/];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT)
  .map((p) => relative(OUT, p).split(sep).join("/"))
  .filter((f) => !SKIP.some((r) => r.test(f)))
  // Only precache what the app needs offline; marketing HTML is cached on visit (runtime).
  .filter((f) => f.startsWith("_next/static/") || f.startsWith("app/") || f.startsWith("icons/") || f === "manifest.webmanifest" || f === "index.html");

const hash = createHash("sha256");
for (const f of files) hash.update(f).update(readFileSync(join(OUT, f)));
const version = hash.digest("hex").slice(0, 12);

const urls = files.map((f) => "/" + f.replace(/index\.html$/, ""));
const sw = `/* Growlilo service worker — generated ${new Date().toISOString()} */
const VERSION = "growlilo-${version}";
const PRECACHE = ${JSON.stringify(urls)};
const OFFLINE_URL = "/app/offline/";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // Never cache API, auth or payment traffic (PRD §11.5).
  if (url.pathname.startsWith("/api/")) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(async () => (await caches.match(req, { ignoreSearch: true })) || (await caches.match(OFFLINE_URL))),
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: url.pathname.startsWith("/_next/static/") || url.pathname.endsWith(".txt") }).then(
      (hit) => hit || fetch(req).then((res) => {
        if (res.ok && (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.endsWith(".txt"))) {
          const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }),
    ),
  );
});
`;
writeFileSync(join(OUT, "sw.js"), sw);
console.log(`sw.js written: ${urls.length} precached URLs, version ${version}`);
