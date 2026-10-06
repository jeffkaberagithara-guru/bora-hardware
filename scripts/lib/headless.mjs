/**
 * Shared headless-browser plumbing for the audits that need a real browser.
 *
 * One implementation of two things that are easy to get subtly wrong:
 * spawning `next start` as a direct node process (killing an `npx` wrapper
 * leaves an orphaned server holding the port, which then serves a stale build
 * to the next run), and locating Chrome/Edge without downloading anything.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const browserPath = () => {
  if (process.env.BROWSER_PATH) return process.env.BROWSER_PATH;
  const candidates =
    process.platform === "win32"
      ? [
          "C:/Program Files/Google/Chrome/Application/chrome.exe",
          "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
          "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
          "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
        ]
      : process.platform === "darwin"
        ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
        : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/microsoft-edge"];
  const found = candidates.find((path) => existsSync(path));
  if (!found) throw new Error("No Chrome/Edge found — set BROWSER_PATH.");
  return found;
};

/** Starts a production server unless one is already answering. */
export async function ensureServer(port) {
  const base = process.env.AUDIT_BASE_URL ?? `http://localhost:${port}`;
  try {
    if ((await fetch(base, { signal: AbortSignal.timeout(1500) })).ok) {
      console.warn(
        `⚠ ${base} is already answering — reusing it. Rebuild first if the source changed.`,
      );
      return { base, child: null };
    }
  } catch {
    /* not running — start one */
  }
  console.log(`Starting next start on ${port}…`);
  const child = spawn(
    process.execPath,
    [join(root, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port)],
    { cwd: root, stdio: "ignore", windowsHide: true },
  );
  child.on("error", () => {});
  for (let i = 0; i < 60; i += 1) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      if ((await fetch(base, { signal: AbortSignal.timeout(1000) })).ok) return { base, child };
    } catch {
      /* not up yet */
    }
  }
  child.kill();
  throw new Error("Server did not start.");
}

export function launchBrowser() {
  return puppeteer.launch({
    executablePath: browserPath(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
}
