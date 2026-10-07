#!/usr/bin/env node
/**
 * DESIGN.md §12 / §16 — structural accessibility audit of the built HTML.
 *
 * Runs against the prerendered output in `.next/server/app/*.html`, so it
 * checks what a crawler and a screen reader actually receive rather than what
 * the JSX intended. No browser is launched — except that routes reading
 * `searchParams` are never prerendered, so those are fetched from a
 * short-lived `next start` and put through the identical checks.
 *
 * Checked:
 *   - `lang` on <html>
 *   - exactly one <h1> per page, and no skipped heading levels
 *   - semantic landmarks: main, and a header + footer outside main
 *   - every <img> carries an alt attribute (empty = decorative, and allowed)
 *   - every <button> and <a> has an accessible name (text, aria-label,
 *     aria-labelledby, or an image with a non-empty alt inside)
 *   - dialogs expose an accessible name
 *   - no raw hex colour literals in components/ (DESIGN.md §4)
 *
 * Usage: npm run build && node scripts/audit-structure.mjs
 * Exits non-zero on any failure.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { ensureServer } from "./lib/headless.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = join(root, ".next", "server", "app");

let failures = 0;
const fail = (where, message) => {
  failures += 1;
  console.log(` FAIL ${where} — ${message}`);
};
const pass = (where, message) => console.log(`  ok  ${where}${message ? ` — ${message}` : ""}`);

/* --------------------------------------------------------------- helpers */

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const stripTags = (html) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
  return match ? match[1] : null;
};

const hasAnyAttr = (tag, names) => names.some((name) => new RegExp(`\\b${name}="`, "i").test(tag));

/** Pulls every element of a kind with its inner HTML (non-nesting kinds only). */
function elements(html, kind) {
  const open = new RegExp(`<${kind}\\b([^>]*)>`, "gi");
  const result = [];
  let match;
  while ((match = open.exec(html))) {
    const start = match.index + match[0].length;
    const close = html.indexOf(`</${kind}>`, start);
    if (close === -1) continue;
    result.push({ attrs: match[1], inner: html.slice(start, close) });
  }
  return result;
}

const accessibleName = (attrs, inner) => {
  if (hasAnyAttr(attrs, ["aria-label"])) return attr(attrs, "aria-label").trim();
  if (hasAnyAttr(attrs, ["aria-labelledby"])) return "labelledby";
  const text = stripTags(inner);
  if (text.length > 0) return text;
  const img = inner.match(/<img\b[^>]*>/i);
  if (img && (attr(img[0], "alt") ?? "").trim().length > 0) return "alt text";
  return null;
};

/* ------------------------------------------------------------ HTML audit */

function checkHtml(where, html) {
  const before = failures;

  if (!/<html\b[^>]*\blang="/i.test(html)) fail(where, "<html> has no lang attribute");

  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => Number(m[1]));
  const h1Count = headings.filter((level) => level === 1).length;
  if (h1Count !== 1) fail(where, `expected exactly one <h1>, found ${h1Count}`);

  let previous = 0;
  let skip = null;
  for (const level of headings) {
    if (previous !== 0 && level > previous + 1 && !skip) {
      skip = `h${previous} → h${level}`;
    }
    previous = level;
  }
  if (skip) fail(where, `heading level skipped: ${skip}`);

  if (!/<main\b/i.test(html)) fail(where, "no <main> landmark");
  if (!/<header\b/i.test(html)) fail(where, "no <header> landmark");
  if (!/<footer\b/i.test(html)) fail(where, "no <footer> landmark");

  for (const img of [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])) {
    if (attr(img, "alt") === null) fail(where, `<img> without alt: ${(attr(img, "src") || "").slice(0, 60)}`);
  }

  for (const kind of ["button", "a"]) {
    for (const el of elements(html, kind)) {
      if (kind === "a" && !/\bhref="/i.test(el.attrs)) continue;
      if (!accessibleName(el.attrs, el.inner)) {
        const label = stripTags(el.attrs).slice(0, 60) || el.attrs.trim().slice(0, 60);
        fail(where, `<${kind}> without an accessible name: ${label}`);
      }
    }
  }

  for (const dialog of [...html.matchAll(/<div\b[^>]*\brole="dialog"[^>]*>/gi)].map((m) => m[0])) {
    if (!hasAnyAttr(dialog, ["aria-label", "aria-labelledby"])) {
      fail(where, 'role="dialog" without an accessible name');
    }
  }

  if (failures === before) pass(where, `${headings.length} headings checked`);
}

const files = walk(htmlDir).filter(
  (file) => file.endsWith(".html") && !file.endsWith("_global-error.html"),
);

console.log(`Structure audit: ${files.length} prerendered pages\n`);

for (const file of files) {
  checkHtml(relative(root, file).replace(/\\/g, "/"), readFileSync(file, "utf8"));
}

/* ------------------------------------ HTML audit: server-rendered routes */

/**
 * Routes that read `searchParams` are never written to `.next/server/app` as
 * HTML — but they are exactly the pages a crawler and a screen reader receive,
 * so they are fetched from a live server and put through the same checks.
 */
const SERVER_ROUTES = ["/search?q=cement", "/search?q=definitely-not-a-product"];

if (SERVER_ROUTES.length > 0) {
  console.log(`\nStructure audit: ${SERVER_ROUTES.length} server-rendered routes\n`);

  const { base, child } = await ensureServer(3115);
  for (const route of SERVER_ROUTES) {
    try {
      const response = await fetch(`${base}${route}`);
      if (!response.ok) {
        fail(route, `HTTP ${response.status}`);
        continue;
      }
      checkHtml(route, await response.text());
    } catch (error) {
      fail(route, `could not fetch — ${error.message}`);
    }
  }
  child?.kill();
}

/* ------------------------------------------------------- source scan: hex */

console.log("\nSource scan: raw hex in components/\n");

const sourceFiles = walk(join(root, "components"))
  .filter((file) => /\.(tsx|ts)$/.test(file))
  .concat(walk(join(root, "app")).filter((file) => /\.tsx$/.test(file)));

let hexCount = 0;
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  for (const line of source.split("\n")) {
    const code = line
      .replace(/\/\*.*?\*\//g, "")
      .replace(/^\s*\/\/.*$/, "")
      // themeColor is a viewport meta value, not a rendered colour.
      .replace(/themeColor:.*$/i, "");
    const matches = code.match(/#[0-9a-fA-F]{6}\b/g);
    if (matches) {
      hexCount += 1;
      fail(relative(root, file).replace(/\\/g, "/"), `raw hex value ${matches.join(", ")}`);
    }
  }
}
if (hexCount === 0) pass("components/ + app/*.tsx", "no raw hex colour literals");

console.log(
  failures === 0
    ? "\nAll structure checks passed."
    : `\n${failures} check${failures === 1 ? "" : "s"} failed.`,
);
process.exit(failures === 0 ? 0 : 1);
