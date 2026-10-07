#!/usr/bin/env node
/**
 * Derives the product photographs for lines that share a subject.
 *
 * The catalogue has one stock frame per *kind* of thing — one drill, one
 * grinder, one bundle of cable — but a real price list has several models of
 * each. Rather than paste the identical file across cards (which reads as a
 * bug in a grid) or ship a photograph of the wrong tool (which reads as a lie),
 * each derived line gets its own 3:2 frame cut from the photograph of its own
 * subject, at a different zoom and offset.
 *
 * Everything here is deterministic: same source, same manifest, same bytes.
 *
 * Usage: node scripts/derive-product-images.mjs   (requires sharp)
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const img = (file) => join(root, "public", "img", file);

const WIDTH = 900;
const HEIGHT = 600;

/** Manifest: output file → source frame + how to re-frame it. */
const MANIFEST = [
  /* ------------------------------------------------------------- power tools */
  ["p-impact-driver-18v.jpg", "p-cordless-drill.jpg", 1.25, "center"],
  ["p-drill-driver-12v.jpg", "p-cordless-drill.jpg", 1.15, "top"],
  ["p-hammer-drill-850w.jpg", "p-rotary-hammer.jpg", 1.3, "center"],
  ["p-angle-grinder-125.jpg", "p-angle-grinder.jpg", 1.2, "right"],
  ["p-angle-grinder-185.jpg", "p-angle-grinder.jpg", 1.35, "left"],
  ["p-welder-250a.jpg", "p-welder.jpg", 1.2, "top"],

  /* ------------------------------------------------------------ hand tools */
  ["p-claw-hammer-20oz.jpg", "p-claw-hammer.jpg", 1.2, "center"],
  ["p-rip-saw-24in.jpg", "p-hand-saw.jpg", 1.2, "bottom"],
  ["p-spanner-set.jpg", "p-toolbox-set.jpg", 1.25, "left"],
  ["p-screwdriver-set.jpg", "p-toolbox-set.jpg", 1.3, "right"],
  ["p-adjustable-spanner.jpg", "p-toolbox-set.jpg", 1.45, "center"],

  /* ------------------------------------------------------------ electrical */
  ["p-cable-15.jpg", "p-cable-25.jpg", 1.2, "top"],
  ["p-cable-10.jpg", "p-cable-25.jpg", 1.4, "left"],
  ["p-cable-6.jpg", "p-cable-4.jpg", 1.25, "bottom"],
  ["p-cable-3core.jpg", "p-cable-4.jpg", 1.4, "center"],
  ["p-switch-1gang.jpg", "p-switch-16a.jpg", 1.2, "left"],
  ["p-switch-4gang.jpg", "p-switch-16a.jpg", 1.3, "right"],
  ["p-energy-meter-60a.jpg", "p-energy-meter.jpg", 1.25, "center"],

  /* ------------------------------------------------------------- plumbing */
  ["p-pvc-pipe-2in.jpg", "p-pvc-pipe.jpg", 1.3, "top"],
  ["p-pvc-pipe-3in.jpg", "p-pvc-pipe.jpg", 1.15, "bottom"],
  ["p-pvc-pipe-6in.jpg", "p-pvc-pipe.jpg", 1.4, "center"],
  ["p-galv-pipe-34in.jpg", "p-galv-pipe.jpg", 1.25, "top"],
  ["p-galv-pipe-15in.jpg", "p-galv-pipe.jpg", 1.4, "bottom"],

  /* --------------------------------------------------- building materials */
  ["p-cement-masonry.jpg", "p-cement.jpg", 1.25, "left"],
  ["p-block-9in.jpg", "p-blocks.jpg", 1.25, "right"],
  ["p-nails-2in.jpg", "p-nails.jpg", 1.3, "top"],
  ["p-nails-4in.jpg", "p-nails.jpg", 1.2, "bottom"],
  ["p-timber-2x2.jpg", "p-timber.jpg", 1.3, "center"],
  ["p-paint-exterior.jpg", "p-paint.jpg", 1.2, "left"],

  /* --------------------------------------------------- safety and workwear */
  ["p-helmet-hdpe.jpg", "p-helmet.jpg", 1.25, "center"],
  ["p-extinguisher-9kg.jpg", "p-extinguisher.jpg", 1.2, "top"],
  ["p-extinguisher-2kg.jpg", "p-extinguisher.jpg", 1.35, "bottom"],
];

const OFFSET = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };

let bytes = 0;
for (const [out, source, zoom, anchor] of MANIFEST) {
  const { width, height } = await sharp(img(source)).metadata();
  let pipeline = sharp(img(source));

  if (zoom > 1) {
    const w = Math.round(width / zoom);
    const h = Math.round(height / zoom);
    const share = OFFSET[anchor] ?? 0.5;
    const axis = anchor === "left" || anchor === "right" ? "x" : anchor === "top" || anchor === "bottom" ? "y" : null;
    const left = Math.round((width - w) * (axis === "x" ? share : 0.5));
    const top = Math.round((height - h) * (axis === "y" ? share : 0.5));
    pipeline = pipeline.extract({ left, top, width: w, height: h });
  }

  const file = await pipeline
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  const { info } = file;
  if (info.width !== WIDTH || info.height !== HEIGHT) {
    throw new Error(`${out} came out ${info.width}×${info.height}`);
  }
  writeFileSync(img(out), file.data);
  bytes += file.data.length;
  console.log(`  ${out.padEnd(28)} from ${source} ×${zoom} (${anchor})`);
}

console.log(`\n${MANIFEST.length} derived frames, ${(bytes / 1024).toFixed(0)}KB total`);
