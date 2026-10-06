#!/usr/bin/env node
/**
 * DESIGN.md §16 — focus audit, in a real browser.
 *
 * The three checks that were still marked "manual — browser only" but which a
 * browser can actually answer:
 *
 *   1. Every tab stop shows a focus indicator. The global `:focus-visible` rule
 *      lives in `@layer base`, so any utility that removes the outline wins
 *      over it — this is what catches that.
 *   2. Dialogs (mobile menu, search, cart) move focus in on open and hand it
 *      back to the trigger on Escape.
 *   3. Every internal link resolves — a typo'd href ships silently until
 *      someone clicks it.
 *
 * Uses puppeteer-core against a browser already on the machine — no download.
 *
 * Usage: npm run build && node scripts/audit-focus.mjs
 *        AUDIT_BASE_URL=http://localhost:3000 to reuse a running server.
 * Exits non-zero on any failure.
 */

import { ensureServer, launchBrowser } from "./lib/headless.mjs";

const PORT = 3114;
let BASE = process.env.AUDIT_BASE_URL ?? `http://localhost:${PORT}`;

const ROUTES = [
  "/",
  "/shop",
  "/shop/power-tools",
  "/product/cordless-drill-18v",
  "/checkout",
  "/contact",
  "/about",
  "/definitely-not-a-page",
];

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.log(` FAIL ${message}`);
};

/* ----------------------------------------------------------------- checks */

/** Reads the focused element: its name, and whether anything marks it. */
const FOCUSED = () => {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 && rect.height < 1) return { name: "hidden focus target", visible: false };
  const s = getComputedStyle(el);
  const outline = s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
  const shadow = !!s.boxShadow && s.boxShadow !== "none";
  const name =
    (el.getAttribute("aria-label") ||
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 34) ||
      el.getAttribute("href") ||
      el.id ||
      el.tagName).slice(0, 40);
  return {
    key: `${el.tagName}:${name}`,
    name,
    tag: el.tagName.toLowerCase(),
    visible: outline || shadow,
    focusVisible: el.matches(":focus-visible"),
    inDialog: !!el.closest('[role="dialog"]'),
  };
};

/** Walks a page with Tab and reports every stop that shows no indicator. */
async function tabThrough(page, route) {
  const seen = new Set();
  const silent = new Set();
  let first = null;
  let stops = 0;

  for (let i = 0; i < 400; i += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(FOCUSED);
    if (!state || state.name === "hidden focus target") break;
    stops += 1;
    if (first === null) first = state.key;
    else if (state.key === first) break; // wrapped around the document

    if (seen.has(state.key)) continue;
    seen.add(state.key);
    if (!state.visible) silent.add(`${state.tag} "${state.name}"`);
    if (!state.focusVisible) silent.add(`${state.tag} "${state.name}" (not :focus-visible)`);
  }

  for (const issue of silent) fail(`focus ${route} — no indicator: ${issue}`);
  process.stdout.write(`  ${route} — ${stops} tab stops, ${seen.size} distinct targets\n`);
}

/** Opens a dialog from its trigger and checks focus in, focus back out. */
async function dialogFocus(page, { name, open, dialog }) {
  await page.evaluate((sel) => {
    const trigger = document.querySelector(sel);
    trigger?.focus();
    if (trigger) trigger.click();
  }, open);

  const shown = await page
    .waitForSelector(dialog, { visible: true, timeout: 5000 })
    .catch(() => null);
  if (!shown) {
    fail(`focus ${name} — dialog did not open`);
    return;
  }
  await new Promise((r) => setTimeout(r, 400));

  const inside = await page.evaluate(() => {
    const el = document.activeElement;
    return !!el && !!el.closest('[role="dialog"]');
  });
  if (!inside) fail(`focus ${name} — focus did not move into the dialog`);

  // Everything reachable inside the dialog must show its focus ring too.
  const seen = new Set();
  const silent = new Set();
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(FOCUSED);
    if (!state || !state.inDialog || seen.has(state.key)) break;
    seen.add(state.key);
    if (!state.visible) silent.add(`${state.tag} "${state.name}"`);
  }
  for (const issue of silent) fail(`focus ${name} — no indicator inside dialog: ${issue}`);

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 400));

  const restored = await page.evaluate((sel) => {
    const trigger = document.querySelector(sel);
    return {
      open: !!document.querySelector('[role="dialog"]'),
      same: !!trigger && document.activeElement === trigger,
      where: document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName,
    };
  }, open);

  if (restored.open) fail(`focus ${name} — Escape did not close the dialog`);
  if (!restored.same) fail(`focus ${name} — focus not restored to trigger (now ${restored.where})`);
  if (restored.same) process.stdout.write(`  ${name} — focus in and restored\n`);
}

/** Every same-origin href on every route must answer. */
async function linkIntegrity(page) {
  const paths = new Set();
  const dead = new Set();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 30000 });
    const found = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href") || ""),
    );
    for (const href of found) {
      if (href === "" || href === "#") {
        dead.add(`${route} → "${href}"`);
        continue;
      }
      if (/^(https?:|mailto:|tel:)/.test(href)) {
        if (/^https?:/.test(href) && !href.startsWith(BASE)) continue; // external
        continue;
      }
      const path = href.split("#")[0] || "/";
      if (path) paths.add(path);
    }
  }

  const broken = [];
  for (const path of [...paths].sort()) {
    try {
      const res = await fetch(BASE + path, { redirect: "follow", signal: AbortSignal.timeout(8000) });
      if (res.status >= 400) broken.push(`${path} → ${res.status}`);
    } catch {
      broken.push(`${path} → no response`);
    }
  }
  for (const issue of broken) fail(`links — ${issue}`);
  for (const issue of dead) fail(`links — empty href at ${issue}`);
  if (broken.length === 0 && dead.size === 0) {
    process.stdout.write(`  ${paths.size} internal links resolve\n`);
  }
}

/* ------------------------------------------------------------------ run */

const server = await ensureServer(PORT);
BASE = server.base;
const browser = await launchBrowser();

console.log(`Focus audit: ${ROUTES.length} routes, keyboard traversal + dialogs\n`);

try {
  const context = await browser.createBrowserContext();

  /* 1 — keyboard traversal at a width where every element is reachable. */
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 300));
    await tabThrough(page, route);
  }

  /* 2 — dialogs restore focus to the trigger they were opened from. */
  await page.setViewport({ width: 390, height: 844 });
  for (const dialog of [
    { name: "mobile menu", open: "[data-menu-trigger]", dialog: '[role="dialog"][aria-label="Site menu"]' },
    { name: "search", open: 'button[aria-label="Search products"]', dialog: '[role="dialog"][aria-labelledby]' },
    { name: "cart", open: 'button[aria-label^="Cart"]', dialog: '[role="dialog"][aria-label="Your cart"]' },
  ]) {
    await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));
    await dialogFocus(page, dialog);
  }

  /* 3 — link integrity across the whole site. */
  await linkIntegrity(page);

  await context.close();
} finally {
  await browser.close();
  if (server.child) server.child.kill();
}

console.log(
  failures === 0
    ? "\nAll focus checks passed."
    : `\n${failures} check${failures === 1 ? "" : "s"} failed.`,
);
process.exit(failures === 0 ? 0 : 1);
