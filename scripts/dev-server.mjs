/**
 * Local server that mirrors the Vercel deployment closely enough to test
 * against: static files from dist/, and the api/ handlers mounted on /api/*.
 *
 * The handlers are written against Node's IncomingMessage/ServerResponse, which
 * is exactly what Vercel's Node runtime passes them, so the code exercised here
 * is the code that ships. TypeScript is loaded through Vite's SSR module
 * pipeline, so no separate build step or extra dependency is needed.
 *
 *   node scripts/dev-server.mjs          # serves dist/ on :4319
 *   E2E_PORT=5000 node scripts/dev-server.mjs
 */
import http from "node:http";
import path from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.E2E_PORT ?? 4319);

if (!existsSync(dist)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(1);
}

const vite = await createViteServer({
  root,
  appType: "custom",
  server: { middlewareMode: true },
  logLevel: "warn",
});

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

const sendFile = (res, filePath) => {
  const body = readFileSync(filePath);
  res.statusCode = 200;
  res.setHeader("content-type", MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream");
  res.setHeader("content-length", body.length);
  res.end(body);
};

const notFound = (res) => {
  res.statusCode = 404;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.end("Not found");
};

/** Resolves a request path to a file inside dist/, refusing anything that
 *  escapes it. */
const resolveStatic = (pathname) => {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.resolve(dist, `.${decoded}`);
  if (candidate !== dist && !candidate.startsWith(dist + path.sep)) return null;

  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;

  const indexed = path.join(candidate, "index.html");
  if (existsSync(indexed)) return indexed;

  return null;
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    const relative = url.pathname.replace(/^\/api\//, "").replace(/\/$/, "");
    const modulePath = path.join(root, "api", `${relative}.ts`);

    if (!existsSync(modulePath)) {
      notFound(res);
      return;
    }

    try {
      const module = await vite.ssrLoadModule(`/api/${relative}.ts`);
      await module.default(req, res);
    } catch (error) {
      console.error(`[dev-server] ${url.pathname} failed`, error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "internal_error" }));
      }
    }
    return;
  }

  // Mirrors the production host rewrites in vercel.json: on the audit host the
  // assessment is served at the root and the lead view stays at /admin.
  const isAuditHost = (req.headers.host ?? "").startsWith("audit.");
  const pathname = isAuditHost && !url.pathname.startsWith("/admin")
    ? `/audit${url.pathname === "/" ? "/" : url.pathname}`
    : url.pathname;

  const file = resolveStatic(pathname);
  if (file) {
    sendFile(res, file);
    return;
  }

  // The assessment is a client-rendered app: unknown paths under /audit fall
  // back to its shell so deep links work.
  if (pathname.startsWith("/audit")) {
    const shell = path.join(dist, "audit", "index.html");
    if (existsSync(shell)) {
      sendFile(res, shell);
      return;
    }
  }

  notFound(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`dev-server listening on http://127.0.0.1:${port}`);
  console.log(`  marketing site  http://127.0.0.1:${port}/`);
  console.log(`  systems teardown http://127.0.0.1:${port}/audit/`);
});

const shutdown = async () => {
  await vite.close();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
