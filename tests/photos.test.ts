import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PHOTOS } from "../src/config/photos";

const publicDir = path.resolve(__dirname, "../public");

/** Pixel size from the file header, so the registry cannot drift from the file. */
const dimensions = (file: string): { width: number; height: number } => {
  const buf = readFileSync(file);

  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (kind === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }

  if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      const length = buf.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }

  throw new Error(`Unsupported image format: ${file}`);
};

describe("published photos", () => {
  it("has at least one photo", () => {
    expect(PHOTOS.length).toBeGreaterThan(0);
  });

  it("has no duplicate files", () => {
    const sources = PHOTOS.map((photo) => photo.src);
    expect(new Set(sources).size).toBe(sources.length);
  });

  for (const photo of PHOTOS) {
    describe(photo.src, () => {
      const file = path.join(publicDir, photo.src);

      it("is a site-root path to a file that exists in public/", () => {
        expect(photo.src.startsWith("/")).toBe(true);
        expect(existsSync(file)).toBe(true);
      });

      it("declares the file's real pixel size", () => {
        expect(dimensions(file)).toEqual({ width: photo.width, height: photo.height });
      });

      it("has alt text and a caption in both languages", () => {
        for (const copy of [photo.en, photo.ar]) {
          expect(copy.alt.trim().length).toBeGreaterThan(10);
          expect(copy.caption.trim().length).toBeGreaterThan(5);
        }
        expect(photo.en.alt).not.toBe(photo.ar.alt);
      });
    });
  }
});
