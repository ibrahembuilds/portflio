/**
 * Builds the portrait assets from the original green-screen photograph.
 *
 *   node scripts/portrait.mjs
 *
 * The source is shot on a saturated green, which clashed with the brand once
 * the palette moved to lime and bone. Rather than ask for a re-shoot, the green
 * is keyed out here and the subject is composited onto the brand colours:
 *
 *   src/assets/portrait-{640,960,1280}.webp   subject on the page colour
 *   src/assets/portrait-accent-1280.webp      subject on the accent, for social
 *
 * The key is a soft alpha ramp on "greenness" (g minus the stronger of r and b)
 * rather than a hard threshold, so curly hair keeps its edge instead of being
 * cut into a stencil. Green spill on that edge is then pulled back down, which
 * is what stops a keyed subject reading as a sticker.
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
 *  two it is a partially transparent edge. */
const KEY_LOW = 24;
const KEY_HIGH = 78;

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

      for (let i = 0; i < px.length; i += 4) {
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];

        const greenness = g - Math.max(r, b);
        let alpha = 1;
        if (greenness >= high) alpha = 0;
        else if (greenness > low) alpha = 1 - (greenness - low) / (high - low);

        // Despill: on a keyed edge the green screen has tinted the subject, so
        // the green channel is pulled back to what the other channels support.
        let gg = g;
        if (greenness > 0) gg = Math.max(r, b) + greenness * alpha * 0.35;

        // Composite over the target background in one pass.
        px[i] = Math.round(r * alpha + back[0] * (1 - alpha));
        px[i + 1] = Math.round(gg * alpha + back[1] * (1 - alpha));
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
