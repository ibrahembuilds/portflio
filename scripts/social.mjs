/**
 * Builds the social share cards.
 *
 *   node scripts/social.mjs
 *
 *   public/og-image.png      1200x630, English
 *   public/og-image-ar.png   1200x630, Arabic, laid out right to left
 *
 * The portrait is composited onto the accent by scripts/portrait.mjs, so the
 * card only has to feather the photo's inner edge for the two to read as one
 * surface — no cut-out, no halo. Text is ink on accent, which measures 15.1:1.
 * White text on the accent is 1.24:1 and must never appear here.
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file)).toString("base64");

const photo = read("src/assets/portrait-accent-1280.webp");
const geistBold = read("public/fonts/geist-sans-latin-600-normal.woff2");
const geistRegular = read("public/fonts/geist-sans-latin-400-normal.woff2");
const plexArabicRegular = read("public/fonts/plex-arabic-400-normal.woff2");
const plexArabicBold = read("public/fonts/plex-arabic-600-normal.woff2");

const ACCENT = "#d4f53c";
const INK = "#0b1220";

const card = ({ dir, eyebrow, title, sub, font }) => {
  const photoOnLeft = dir === "rtl";
  const position = photoOnLeft ? "left:-70px" : "right:-70px";
  const textSide = photoOnLeft ? "right:0" : "left:0";
  const fade = photoOnLeft
    ? "linear-gradient(to right, #000 0%, #000 66%, transparent 100%)"
    : "linear-gradient(to right, transparent 0%, #000 34%, #000 100%)";

  return `<!doctype html><html dir="${dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(data:font/woff2;base64,${geistBold}) format('woff2');font-weight:600}
@font-face{font-family:G;src:url(data:font/woff2;base64,${geistRegular}) format('woff2');font-weight:400}
@font-face{font-family:A;src:url(data:font/woff2;base64,${plexArabicBold}) format('woff2');font-weight:600}
@font-face{font-family:A;src:url(data:font/woff2;base64,${plexArabicRegular}) format('woff2');font-weight:400}
*{margin:0;padding:0;box-sizing:border-box}
body{background:${ACCENT}}
.card{width:1200px;height:630px;background:${ACCENT};font-family:${font},G;color:${INK};overflow:hidden;position:relative}
.photo{position:absolute;top:-30px;${position};width:620px;height:700px;
  background-image:url(data:image/webp;base64,${photo});background-size:cover;background-position:top center;
  -webkit-mask-image:${fade};mask-image:${fade};}
.text{position:absolute;top:0;${textSide};width:660px;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 66px;z-index:2}
.eyebrow{font-size:18px;font-weight:400;letter-spacing:.15em;text-transform:uppercase;opacity:.6}
h1{font-size:${photoOnLeft ? 48 : 55}px;line-height:${photoOnLeft ? 1.38 : 1.07};letter-spacing:${photoOnLeft ? "0" : "-0.03em"};font-weight:600;margin-top:20px}
.sub{font-size:21px;line-height:${photoOnLeft ? 1.85 : 1.5};margin-top:22px;opacity:.72;font-weight:400}
.rule{position:absolute;bottom:0;left:0;right:0;height:9px;background:${INK};z-index:3}
</style></head><body>
<div class="card">
  <div class="photo"></div>
  <div class="text">
    <div class="eyebrow">${eyebrow}</div>
    <h1>${title}</h1>
    <div class="sub">${sub}</div>
  </div>
  <div class="rule"></div>
</div>
</body></html>`;
};

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

const cards = [
  {
    file: "public/og-image.png",
    dir: "ltr",
    font: "G",
    eyebrow: "ibrahemahmed.com",
    title: "Internal systems for<br>small businesses.",
    sub: "Custom CRMs, client portals<br>and workflow automation.",
  },
  {
    file: "public/og-image-ar.png",
    dir: "rtl",
    font: "A",
    eyebrow: "ibrahemahmed.com",
    title: "أنظمة تشغيل داخلية<br>للشركات الصغيرة.",
    sub: "أنظمة CRM مخصصة وبوابات عملاء<br>وأتمتة لسير العمل.",
  },
];

for (const { file, ...content } of cards) {
  await page.setContent(card(content));
  await page.waitForTimeout(500);
  // The card is screenshotted as an element, not as the viewport. The portrait
  // is deliberately hung past the card's edge, which makes the document wider
  // than the viewport — and an RTL document parks its scroll origin at the
  // right, so a viewport capture silently slid the Arabic card sideways and
  // sheared the text off its own gutter. Clipping to the element has no scroll
  // origin to get wrong.
  const buffer = await page.locator(".card").screenshot({ type: "png" });
  writeFileSync(path.join(root, file), buffer);
  console.log(`${file}  ${(buffer.length / 1024).toFixed(0)}KB`);
}

await browser.close();
