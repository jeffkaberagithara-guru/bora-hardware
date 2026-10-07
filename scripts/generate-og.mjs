#!/usr/bin/env node
/**
 * Generates `public/img/og-cover.jpg` — the 1200×630 social share card.
 *
 * The card is composed from the design tokens in `app/globals.css` (parsed, not
 * copied) and a crop of the hero photograph, so it cannot drift from the site it
 * represents. Contrast of every text/background pair is asserted before the
 * file is written; a card with unreadable type is worse than no card.
 *
 * Usage: node scripts/generate-og.mjs   (requires sharp, already present via Next)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "img", "og-cover.jpg");

const WIDTH = 1200;
const HEIGHT = 630;
const PANEL = 760; // width of the blue type panel; the rest is photograph

/* ------------------------------------------------------------------ tokens */

const css = readFileSync(join(root, "app", "globals.css"), "utf8");
const token = (name) => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --color-${name} not found in app/globals.css`);
  return match[1];
};

const C = {
  primaryStrong: token("primary-strong"),
  accent: token("accent"),
  accentOnDark: token("accent-on-dark"),
  background: token("background"),
};

/* --------------------------------------------------------------- contrast */

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex) => {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const assertContrast = (fg, bg, min, label) => {
  const ratio = contrast(fg, bg);
  if (ratio < min) {
    throw new Error(`${label}: ${ratio.toFixed(2)}:1 is below the required ${min}:1`);
  }
  return ratio;
};

assertContrast(C.background, C.primaryStrong, 7, "wordmark on primary-strong");
assertContrast(C.accentOnDark, C.primaryStrong, 4.6, "descriptor on primary-strong");
assertContrast(C.accent, C.primaryStrong, 3, "accent rule on primary-strong");

/* ------------------------------------------------------------------ layout */

const esc = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.primaryStrong}"/>

  <g font-family="'Arial Black', Arial, Helvetica, sans-serif">
    <text x="72" y="212" font-size="104" letter-spacing="-2" fill="${C.background}">BORA</text>
    <text x="72" y="316" font-size="104" letter-spacing="-2" fill="${C.background}">HARDWARE</text>
  </g>

  <rect x="72" y="356" width="132" height="8" fill="${C.accent}"/>

  <text x="72" y="432" font-family="'Segoe UI', Arial, Helvetica, sans-serif" font-size="40" fill="${C.background}">Genuine gear. Honest prices.</text>

  <text x="72" y="516" font-family="Consolas, 'Courier New', monospace" font-size="22" letter-spacing="4" fill="${C.accentOnDark}">${esc(
    "TOOLS · ELECTRICAL · PLUMBING · BUILDING",
  )}</text>

  <text x="72" y="574" font-family="'Segoe UI', Arial, Helvetica, sans-serif" font-size="22" fill="${C.background}" opacity="0.9">Nairobi, Kenya</text>
</svg>`;

const base = await sharp(Buffer.from(svg)).png().toBuffer();

/* --------------------------------------------------------------- photograph */

// Right-hand panel: a crop of the hero, attention-weighted so the drill and the
// hands stay inside a 440×630 frame instead of being cut at the elbows.
const photo = await sharp(join(root, "public", "img", "hero-fundi.jpg"))
  .resize(WIDTH - PANEL, HEIGHT, { fit: "cover", position: "attention" })
  .jpeg({ quality: 86 })
  .toBuffer();

const card = await sharp(base)
  .composite([{ input: photo, left: PANEL, top: 0 }])
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
  .toBuffer();

writeFileSync(OUT, card);

const meta = await sharp(OUT).metadata();
console.log(
  `og-cover: ${meta.width}×${meta.height}, ${(card.length / 1024).toFixed(0)}KB — ${meta.width === WIDTH && meta.height === HEIGHT ? "ok" : "WRONG SIZE"}`,
);
console.log(
  `contrast: wordmark ${contrast(C.background, C.primaryStrong).toFixed(2)}:1, descriptor ${contrast(
    C.accentOnDark,
    C.primaryStrong,
  ).toFixed(2)}:1`,
);
