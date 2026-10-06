#!/usr/bin/env node
/**
 * DESIGN.md §11 / §16 — layout audit, in a real browser.
 *
 * The three checks that cannot be answered from source or from prerendered
 * HTML, so they were the ones left unchecked:
 *
 *   1. No horizontal overflow at any width 320 → 1920.
 *   2. Every interactive target is ≥ 44×44px below 768px (DESIGN's own rule,
 *      stricter than WCAG 2.5.8's 24×24).
 *   3. `prefers-reduced-motion: reduce` leaves nothing hidden and nothing
 *      animating for longer than 50ms.
 *
 * Uses puppeteer-core against a browser already on the machine — no download.
 *
 * Usage: npm run build && node scripts/audit-layout.mjs
 *        AUDIT_BASE_URL=http://localhost:3000 to reuse a running server.
 * Exits non-zero on any failure.
 */

import { ensureServer, launchBrowser } from "./lib/headless.mjs";

const PORT = 3113;
let BASE = process.env.AUDIT_BASE_URL ?? `http://localhost:${PORT}`;

const ROUTES = [
  "/",
  "/shop",
  "/shop/power-tools",
  "/shop/hardware-accessories",
  "/product/cordless-drill-18v",
  "/checkout",
  "/contact",
  "/about",
  "/definitely-not-a-page",
];

const WIDTHS = [320, 360, 390, 430, 540, 768, 1024, 1280, 1440, 1680, 1920];
const TOUCH_WIDTHS = WIDTHS.filter((w) => w < 768);

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.log(` FAIL ${message}`);
};

/* ---------------------------------------------------------------- pages */

const evaluate = (page, fn, ...args) => page.evaluate(fn, ...args);

/** 1 — horizontal overflow: reports the elements that actually stick out. */
const OVERFLOW = () => {
  const docWidth = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.position === "fixed") continue;
    if (rect.right > docWidth + 1 || rect.left < -1) {
      bad.push(
        `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}` +
          ` [${Math.round(rect.left)}…${Math.round(rect.right)} vs ${docWidth}]`,
      );
      if (bad.length >= 3) break;
    }
  }
  return document.documentElement.scrollWidth > docWidth + 1 ? bad : [];
};

/** 2 — touch targets below 768px. `root` scopes the walk to an open overlay. */
const TOUCH = (root) => {
  const SMALL = "(max-width: 767px)";
  if (!window.matchMedia(SMALL).matches) return [];
  const scope = root ? document.querySelector(root) : document;
  if (!scope) return [];
  const bad = [];

  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    const style = getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
  };

  // A link whose ::after is stretched over a whole card (the product-card
  // pattern) can be tapped anywhere on that card, so the pseudo's box — not
  // the inline text box — is the real target.
  const targetRect = (host) => {
    const after = getComputedStyle(host, "::after");
    if (after.content !== "none" && after.position === "absolute") {
      const w = parseFloat(after.width);
      const h = parseFloat(after.height);
      if (w >= 2 && h >= 2) return { width: w, height: h };
    }
    return host.getBoundingClientRect();
  };

  const label = (el, rect) => {
    const name =
      el.getAttribute("aria-label") ||
      (el.textContent || "").trim().slice(0, 30) ||
      el.getAttribute("href") ||
      el.className;
    return `${el.tagName.toLowerCase()} "${name}" ${Math.round(rect.width)}×${Math.round(rect.height)}`;
  };

  for (const el of document.querySelectorAll("button, select, a[href], [role='button']")) {
    if (el.closest(".sr-only") || el.classList.contains("sr-only")) continue;
    if (el.disabled) continue;
    if (!visible(el)) continue;
    // A control wrapped in a larger label is activated through the label.
    const host = el.type === "radio" || el.type === "checkbox" ? el.closest("label") : null;
    const rect = targetRect(host ?? el);
    if (rect.width < 44 || rect.height < 44) bad.push(label(el, rect));
  }

  // Radios and checkboxes are judged through their label, checked above.
  for (const el of document.querySelectorAll("input[type='radio'], input[type='checkbox']")) {
    if (el.disabled || !visible(el)) continue;
    const host = el.closest("label");
    const rect = (host ?? el).getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      bad.push(`input[type=${el.type}] ${Math.round(rect.width)}×${Math.round(rect.height)}`);
    }
  }
  return [...new Set(bad)];
};

/** 3 — reduced motion: nothing animating, nothing left invisible. */
const REDUCED = () => {
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    for (const prop of ["transitionDuration", "animationDuration"]) {
      const value = style[prop];
      if (!value || value === "0s") continue;
      const seconds = value.split(",").map((v) => parseFloat(v));
      if (seconds.some((s) => s > 0.05)) {
        bad.push(`${prop} ${value} on ${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
        break;
      }
    }
    if (bad.length >= 5) break;
  }
  const main = document.querySelector("main");
  if (main && getComputedStyle(main).opacity !== "1") bad.push("main is not fully opaque");
  for (const el of document.querySelectorAll("main *")) {
    if (el.disabled) continue; // `disabled:opacity-40` is a state, not a motion
    if (Number(getComputedStyle(el).opacity) < 0.9 && el.getBoundingClientRect().height > 0) {
      bad.push(`content stuck at opacity ${getComputedStyle(el).opacity}: ${el.tagName.toLowerCase()}`);
      break;
    }
  }
  return bad;
};

/* --------------------------------------------------------------- overlays */

/**
 * The three mobile overlays are rendered client-side only, so they never
 * appear in the prerendered HTML the route loop above can see. Each is opened
 * at 390px and measured inside its own dialog.
 *
 * The cart is opened from a product page with an item already added, so the
 * quantity stepper and remove button get measured too.
 */
const OVERLAYS = [
  {
    name: "mobile menu",
    open: '[data-menu-trigger]',
    dialog: '[role="dialog"][aria-label="Site menu"]',
  },
  {
    name: "search",
    open: 'button[aria-label="Search products"]',
    dialog: '[role="dialog"][aria-labelledby]',
  },
  {
    name: "cart",
    open: 'button[aria-label^="Cart"]',
    dialog: '[role="dialog"][aria-label="Your cart"]',
    withItem: true,
  },
];

async function auditOverlays(page) {
  // Entrance animations scale the panel, and a scaled 44px box measures as
  // ~43px — so the measurement waits for every running animation to finish
  // rather than racing the dialogIn transition.
  const settle = async () => {
    await page
      .evaluate(() =>
        Promise.race([
          Promise.all(document.getAnimations().map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 3000)),
        ]),
      )
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 200));
  };

  for (const overlay of OVERLAYS) {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE + (overlay.withItem ? "/product/cordless-drill-18v" : "/"), {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    await settle();

    if (overlay.withItem) {
      const added = await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label^="Add "]');
        if (!btn) return false;
        btn.click();
        return true;
      });
      if (!added) fail(`overlay ${overlay.name} — no add-to-cart button on the page`);
      await new Promise((r) => setTimeout(r, 300));
    }

    await page.evaluate((sel) => document.querySelector(sel)?.click(), overlay.open).catch(() => {});
    const opened = await page
      .waitForSelector(overlay.dialog, { visible: true, timeout: 5000 })
      .catch(() => null);
    if (!opened) {
      fail(`overlay ${overlay.name} — did not open`);
      continue;
    }
    await settle();
    for (const issue of await page.evaluate(TOUCH, overlay.dialog)) {
      fail(`touch @390px overlay:${overlay.name} — ${issue}`);
    }
    process.stdout.write(`  checked overlay ${overlay.name}\n`);
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));
  }
}


/* ------------------------------------------------------------------ run */

const server = await ensureServer(PORT);
BASE = server.base;
const browser = await launchBrowser();

console.log(`Layout audit: ${ROUTES.length} routes × ${WIDTHS.length} widths\n`);

try {
  for (const reduced of [false, true]) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    // Width is the only variable that matters: every check is CSS media-query
    // driven. Toggling isMobile/hasTouch would force a reload per width for no
    // behavioural difference in what we measure.
    await page.setViewport({ width: 390, height: 844 });
    if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

    for (const route of ROUTES) {
      const response = await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 30000 });
      if (!response || response.status() >= 500) fail(`${route} → HTTP ${response?.status()}`);

      if (reduced) {
        for (const issue of await evaluate(page, REDUCED)) fail(`reduced-motion ${route} — ${issue}`);
        continue;
      }

      const touch = new Map();
      for (const width of WIDTHS) {
        await page.setViewport({ width, height: width < 768 ? 844 : 900 });
        await new Promise((r) => setTimeout(r, 120));
        for (const issue of await evaluate(page, OVERFLOW)) {
          fail(`overflow @${width}px ${route} — ${issue}`);
        }

        if (TOUCH_WIDTHS.includes(width)) {
          for (const issue of await evaluate(page, TOUCH)) {
            touch.set(issue, [...(touch.get(issue) ?? []), width]);
          }
        }
      }
      // One line per offending target, with the widths it failed at — the same
      // target is small at every width, and repeating it five times helps nobody.
      for (const [issue, widths] of touch) fail(`touch @${widths.join(",")}px ${route} — ${issue}`);
      process.stdout.write(`  checked ${route}\n`);
    }
    if (!reduced) await auditOverlays(page);
    await context.close();
  }
} finally {
  await browser.close();
  if (server.child) server.child.kill();
}

console.log(
  failures === 0
    ? "\nAll layout checks passed."
    : `\n${failures} check${failures === 1 ? "" : "s"} failed.`,
);
process.exit(failures === 0 ? 0 : 1);
