import { inflateSync } from "node:zlib";

/**
 * Reads the visible text out of a generated PDF.
 *
 * pdfkit compresses its content streams and writes text either as literal
 * `(...)` strings or as `<hex>` strings inside a TJ array, so both forms are
 * decoded here. Working against the real compressed artifact means the tests
 * assert on exactly what a prospect would download.
 */
export const pdfText = (buffer: Buffer): string => {
  const raw = buffer.toString("latin1");
  const pieces: string[] = [];

  const decodeHex = (hex: string): string => {
    const clean = hex.replace(/\s+/g, "");
    let out = "";
    for (let index = 0; index + 1 < clean.length; index += 2) {
      out += String.fromCharCode(Number.parseInt(clean.slice(index, index + 2), 16));
    }
    return out;
  };

  const readOperators = (content: string) => {
    for (const match of content.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)) {
      pieces.push(match[1].replace(/\\([()\\])/g, "$1"));
    }
    for (const match of content.matchAll(/<([0-9A-Fa-f\s]*)>\s*Tj/g)) {
      pieces.push(decodeHex(match[1]));
    }
    for (const group of content.matchAll(/\[((?:\\.|[^\]])*)\]\s*TJ/g)) {
      let line = "";
      for (const token of group[1].matchAll(/\(((?:\\.|[^\\)])*)\)|<([0-9A-Fa-f\s]*)>/g)) {
        line += token[1] !== undefined ? token[1].replace(/\\([()\\])/g, "$1") : decodeHex(token[2] ?? "");
      }
      pieces.push(line);
    }
  };

  // "endstream" also ends in "stream", so only match a real stream opener.
  const pattern = /(?<!end)stream\r?\n/g;
  let match = pattern.exec(raw);
  while (match) {
    const start = match.index + match[0].length;
    const end = raw.indexOf("endstream", start);
    if (end === -1) break;

    const slice = Buffer.from(raw.slice(start, end), "latin1");
    try {
      readOperators(inflateSync(slice).toString("latin1"));
    } catch {
      // Not deflate (an uncompressed stream or embedded font): read as-is.
      readOperators(slice.toString("latin1"));
    }

    pattern.lastIndex = end;
    match = pattern.exec(raw);
  }

  // Structural assertions (page objects, %%EOF) need the raw bytes too.
  return `${pieces.join("\n")}\n---RAW---\n${raw}`;
};
