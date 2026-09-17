/**
 * Builds the portrait assets from the source photograph.
 *
 *   node scripts/portrait.mjs
 *
 * The source is shot on a plain, near-uniform studio backdrop rather than a
 * green screen, so the key does not assume any particular backdrop colour.
 * Instead it samples the backdrop directly from the photo's own top corners
 * (above the subject's shoulders, where the backdrop always shows) and keys
 * out whatever is close to that sampled colour. That makes the same script
 * work whether the backdrop is a saturated green screen or, as here, a pale
 * studio grey close to the page colour — reshoot on a different backdrop and
 * this still keys correctly with no code change.
 *
 * The subject is then composited onto the brand colours:
 *
 *   src/assets/portrait-{640,960,1280}.webp   subject on the page colour
 *   src/assets/portrait-accent-1280.webp      subject on the accent, for social
 *
 * The key is a soft alpha ramp on colour distance from the sampled backdrop
 * rather than a hard threshold, so curly hair keeps its edge instead of being
 * cut into a stencil.
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SOURCE = process.env.PORTRAIT_SOURCE ?? path.join(root, "src/assets/portrait-source.png");
const PAGE = "#faf9f6";
const ACCENT = "#d4f53c";

/** Below this the pixel is the subject, above it the background; between the
 *  two it is a partially transparent edge. Measured in RGB Euclidean distance
 *  from the sampled backdrop colour (0-441). */
const KEY_LOW = 34;
const KEY_HIGH = 92;

const key = async (page, base64, { width, background }) =>
  page.evaluate(
    async ([data, size, bg, low, high]) => {
      const img = new Image();
      img.src = "data:image/png;base64," + data;
      await img.decode();

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, size, size);

      const frame = ctx.getImageData(0, 0, size, size);
      const px = frame.data;

      const back = [1, 3, 5].map((i) => parseInt(bg.slice(i, i + 2), 16));

      // Sample the backdrop from points across the top strip, above the
      // subject's shoulders, and average them — that is the one region every
      // portrait crop shares regardless of framing or backdrop colour.
      const sampleAt = (x, y) => {
        const o = (y * size + x) * 4;
        return [px[o], px[o + 1], px[o + 2]];
      };
      const samplePoints = [0.05, 0.25, 0.5, 0.75, 0.95].map((f) => sampleAt(Math.round(f * (size - 1)), 3));
      const backdrop = [0, 1, 2].map(
        (c) => samplePoints.reduce((sum, sample) => sum + sample[c], 0) / samplePoints.length,
      );

      for (let i = 0; i < px.length; i += 4) {
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];

        const distance = Math.hypot(r - backdrop[0], g - backdrop[1], b - backdrop[2]);
        let alpha = 1;
        if (distance <= low) alpha = 0;
        else if (distance < high) alpha = (distance - low) / (high - low);

        // Composite over the target background in one pass. Blending toward
        // the true target colour on a partially transparent edge is what
        // keeps that edge from reading as a grey fringe against either
        // background.
        px[i] = Math.round(r * alpha + back[0] * (1 - alpha));
        px[i + 1] = Math.round(g * alpha + back[1] * (1 - alpha));
        px[i + 2] = Math.round(b * alpha + back[2] * (1 - alpha));
        px[i + 3] = 255;
      }

      ctx.putImageData(frame, 0, 0);
      return canvas.toDataURL("image/webp", 0.87);
    },
    [base64, width, background, KEY_LOW, KEY_HIGH],
  );

const source = readFileSync(SOURCE).toString("base64");
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage();

const outputs = [
  { file: "src/assets/portrait-640.webp", width: 640, background: PAGE },
  { file: "src/assets/portrait-960.webp", width: 960, background: PAGE },
  { file: "src/assets/portrait-1280.webp", width: 1280, background: PAGE },
  { file: "src/assets/portrait-accent-1280.webp", width: 1280, background: ACCENT },
];

for (const output of outputs) {
  const data = await key(page, source, output);
  const buffer = Buffer.from(data.split(",")[1], "base64");
  writeFileSync(path.join(root, output.file), buffer);
  console.log(`${output.file}  ${(buffer.length / 1024).toFixed(0)}KB  on ${output.background}`);
}

await browser.close();
