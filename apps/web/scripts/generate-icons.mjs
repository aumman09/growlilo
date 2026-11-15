// One-off asset generator. Usage: NODE_PATH=$(npm root -g) node scripts/generate-icons.mjs
// Requires `sharp` (installed globally or as a devDependency). Outputs are committed to public/icons.
import { createRequire } from "module";
import { readFileSync } from "fs";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const icon = readFileSync(new URL("../public/icons/icon.svg", import.meta.url));
const mask = readFileSync(new URL("./icon-maskable.svg", import.meta.url));
const out = (n) => new URL(`../public/icons/${n}`, import.meta.url).pathname;
await sharp(icon, { density: 600 }).resize(192, 192).png().toFile(out("icon-192.png"));
await sharp(icon, { density: 600 }).resize(512, 512).png().toFile(out("icon-512.png"));
await sharp(mask, { density: 600 }).resize(512, 512).png().toFile(out("icon-maskable-512.png"));
await sharp(mask, { density: 600 }).resize(180, 180).png().toFile(out("apple-touch-icon.png"));
console.log("icons written");
