#!/usr/bin/env node
/**
 * DESIGN.md §4 / §12 — contrast audit.
 *
 * Two jobs, both computed rather than eyeballed:
 *
 *   1. The token table in DESIGN.md §4.1 must match `app/globals.css` exactly.
 *      DESIGN.md declares itself the source of truth; if the two drift, every
 *      contrast claim in the document becomes a claim about nothing.
 *   2. Every foreground/background pair the UI actually ships must clear its
 *      WCAG 2.1 AA threshold — body ≥ 7:1 (AAA), muted ≥ 4.6:1, UI ≥ 3:1.
 *
 * Usage: node scripts/audit-contrast.mjs
 * Exits non-zero on any failure.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "app", "globals.css"), "utf8");
const design = readFileSync(join(root, "DESIGN.md"), "utf8");

/* ------------------------------------------------------------------ colour */

const hex = (value) => {
  const clean = value.replace("#", "").toLowerCase();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-f]{6}$/.test(full)) throw new Error(`Not a hex colour: ${value}`);
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const luminance = ([r, g, b]) => {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrast = (fg, bg) => {
  const a = luminance(hex(fg));
  const b = luminance(hex(bg));
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
};

/* ------------------------------------------------------------- token tables */

// Tokens declared in DESIGN.md §4.1 (the source of truth).
const declared = new Map();
for (const line of design.split("\n")) {
  const match = line.match(/^\|\s*`(--color-[a-z0-9-]+)`\s*\|\s*`?(#[0-9A-Fa-f]{3,8})`?\s*\|/);
  if (match) declared.set(match[1], match[2].toLowerCase());
}

// Tokens actually shipped in globals.css.
const shipped = new Map();
const theme = css.match(/@theme\s*\{[\s\S]*?\n\}/);
if (!theme) throw new Error("Could not find the @theme block in app/globals.css");
for (const match of theme[0].matchAll(/(--color-[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\s*;/g)) {
  shipped.set(match[1], match[2].toLowerCase());
}

let failures = 0;
const report = (ok, label, detail) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? ` — ${detail}` : ""}`);
};

console.log("Token parity: DESIGN.md §4.1 ↔ app/globals.css\n");

for (const [token, value] of declared) {
  const actual = shipped.get(token);
  report(
    actual === value,
    token.padEnd(26),
    actual === undefined ? "missing from globals.css" : actual !== value ? `design ${value}, shipped ${actual}` : value,
  );
}

const extra = [...shipped.keys()].filter((token) => !declared.has(token));
if (extra.length > 0) {
  console.log(`  note  tokens in globals.css but not in DESIGN.md §4.1: ${extra.join(", ")}`);
}

/* ------------------------------------------------------------ pair checks */

/** [foreground token, background token, minimum ratio, what it is used for] */
const PAIRS = [
  ["--color-text", "--color-background", 7, "body copy"],
  ["--color-text", "--color-surface", 7, "body copy on section bands"],
  ["--color-text-secondary", "--color-background", 7, "secondary body copy"],
  ["--color-text-secondary", "--color-surface", 7, "secondary body on bands"],
  ["--color-muted", "--color-background", 4.6, "captions, metadata"],
  ["--color-muted", "--color-surface", 4.6, "captions on bands"],
  ["--color-primary", "--color-background", 4.5, "links, active nav"],
  ["--color-primary", "--color-primary-soft", 4.5, "active department chip"],
  ["--color-primary", "--color-surface", 4.5, "links on bands"],
  ["--color-accent-deep", "--color-background", 4.5, "orange used as text"],
  ["--color-accent-deep", "--color-surface", 4.5, "orange text on bands"],
  ["--color-accent-ink", "--color-accent", 7, "CTA label on the accent fill"],
  ["--color-accent-on-dark", "--color-primary", 4.5, "headline accent on blue"],
  ["--color-accent-on-dark", "--color-primary-strong", 4.5, "footer accent on deep blue"],
  ["--color-white", "--color-primary", 4.5, "button label on primary"],
  ["--color-white", "--color-primary-strong", 4.5, "footer copy on deep blue"],
  ["--color-success", "--color-background", 4.5, "in-stock status text"],
  ["--color-danger", "--color-background", 4.5, "error text"],
  ["--color-primary", "--color-background", 3, "focus ring / UI boundary"],
  ["--color-primary", "--color-surface", 3, "focus ring on section bands"],
];

// globals.css has no --color-white token; white is the literal background inverse.
const value = (token) => (token === "--color-white" ? "#ffffff" : shipped.get(token));

console.log("\nContrast: computed WCAG 2.1 ratios\n");

for (const [fg, bg, min, use] of PAIRS) {
  const fgHex = value(fg);
  const bgHex = value(bg);
  if (!fgHex || !bgHex) {
    report(false, `${fg} on ${bg}`, "token not found");
    continue;
  }
  const ratio = contrast(fgHex, bgHex);
  report(
    ratio >= min,
    `${fg.replace("--color-", "")} / ${bg.replace("--color-", "")}`.padEnd(38),
    `${ratio.toFixed(2)}:1 (min ${min}:1) — ${use}`,
  );
}

console.log(
  failures === 0
    ? "\nAll contrast checks passed."
    : `\n${failures} check${failures === 1 ? "" : "s"} failed.`,
);
process.exit(failures === 0 ? 0 : 1);
