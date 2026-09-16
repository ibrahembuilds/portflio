# ibrahemahmed.com

Marketing site and the Systems Teardown lead-generation app, in one repository,
deployed as one Vercel project across two domains.

| Domain | Serves | Indexed |
| --- | --- | --- |
| `ibrahemahmed.com` | Prerendered marketing site | Yes |
| `audit.ibrahemahmed.com` | Systems Teardown assessment | No |
| `audit.ibrahemahmed.com/admin` | Private lead view | No |

## Stack

Vite 5 + React 18 + TypeScript + Tailwind 3, prerendered to static HTML at build
time. Vercel serverless functions in `api/` handle everything the assessment
needs server-side. There is no framework runtime and no client-side router: each
marketing route is its own HTML file.

## Commands

```bash
npm install
npm run dev          # Vite dev server (marketing + assessment, no API)
npm run build        # Build, prerender every route, regenerate sitemap.xml
npm run dev:api      # Serve dist/ with the api/ handlers mounted on /api/*
npm run lint
npm run typecheck
npm run test         # Unit and integration tests (vitest)
npm run e2e          # Browser tests (playwright) — needs `npm run build` first
npm run verify       # lint + typecheck + test + build
```

`npm run dev:api` is the only way to exercise the API locally. It serves the
built `dist/` and loads `api/*.ts` through Vite's SSR pipeline, so the handlers
run exactly as they do on Vercel.

## Layout

```
index.html              Marketing shell; SEO block replaced per route at build
audit/index.html        Assessment shell
admin/index.html        Lead view shell
api/                    Vercel serverless functions (thin; logic lives in src/server)
  audit/                config, website, preview, lead, report, report-pdf, event
  admin/leads.ts        Bearer-token lead list and CSV export
src/
  config/               Shared source of truth: site facts, copy, question set
  marketing/            Prerendered pages and components
  audit/                Assessment client
  admin/                Lead view client
  server/               Server-only modules — never imported by client code
    website/            SSRF-guarded fetch and context extraction
    report/             Schema, deterministic analysis, model orchestration
    store/              Postgres and in-memory lead stores
    email/, llm/, pdf/  Provider abstractions
scripts/
  seo-data.mjs          Per-route titles, descriptions, JSON-LD, sitemap
  prerender.mjs         Renders each route to static HTML
  dev-server.mjs        Local server mirroring the Vercel routing
db/migrations/          SQL to apply to Vercel Postgres
tests/                  Unit and integration tests
e2e/                    Browser tests
```

## Before launch

Two values are deliberately left blank, because guessing either would put a
number in front of a prospect that you have not agreed to:

1. **`SYSTEMS_TEARDOWN_BOOKING_URL`** — your cal.com link. Without it the report
   says "Booking link coming soon" and falls back to your email address.
2. **`INVESTMENT_BANDS` in `src/config/site.ts`** — the indicative price range
   per offer. Every entry is `null`, so the cost section publishes no figure.
   Fill in the ones you are willing to stand behind, e.g.

   ```ts
   automation_sprint: { range: "from £2,500", note: "Covers one connected workflow, tested and documented." },
   ```

   A band is presented as a starting range, never as a quote, and the report
   always says the fixed price comes after the call.

## Brand

Bone page, ink interactive, lime highlight blocks. The palette is measured, not
chosen by eye — the table below is asserted by `tests/palette.test.ts`.

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--background` | `#faf9f6` | The page | 17.8:1 with ink text |
| `--accent` | `#d4f53c` | Fill only: highlight blocks, social cards | 15.1:1 with ink text |
| `--primary` | `#0b1220` | Buttons, links, icons | 18.7:1 with white text |
| `--primary-soft` | `#f1f8d4` | Tinted panels | 10.4:1 with `--primary-strong` |
| `--muted` | `#6b6862` | Secondary text | 5.3:1 on the page |

The accent has two hard rules, both enforced by tests:

- **Never type, never an icon.** White on it is 1.24:1, which fails AA outright.
- **Never a hairline.** Against the page it is 1.18:1, so a 1px rule of it is
  invisible. It appears as a block that carries dark text — the hero caption
  strip, the closing call to action, the report footer, the PDF banner.

The primary button flips from ink to accent on hover; both states clear AA,
which is what makes the flip safe.

The whole palette is one block at the top of `src/index.css`.

### Images

The profile photograph was shot on a green screen. `scripts/portrait.mjs` keys
the green out and composites the subject onto the brand colours, so nothing has
to be re-shot when the palette moves:

```bash
node scripts/portrait.mjs   # src/assets/portrait-*.webp, from portrait-source.png
node scripts/social.mjs     # public/og-image.png and og-image-ar.png
```

## Deployment

1. Attach a Postgres store to the Vercel project and apply the migration:
   ```bash
   psql "$POSTGRES_URL" -f db/migrations/0001_systems_teardown.sql
   ```
2. Set the environment variables from `.env.example` in the Vercel project.
3. Add `audit.ibrahemahmed.com` as a domain on the **same** Vercel project. The
   host-based rewrites in `vercel.json` route it to the assessment; no second
   project is needed.

The application runs with any of these unset. A missing database, model
provider or email provider degrades one part of the flow and is recorded
against the lead — it never loses an enquiry and never shows a prospect an
error page.

## Rules the code enforces

These are business constraints, implemented rather than documented:

- **No invented figures.** Every model-generated report is checked for numbers,
  money amounts, percentages and durations that do not appear in the prospect's
  own answers. A report that invents one is rejected, retried once, then
  replaced by a deterministic report built only from the answers given.
  (`src/server/report/schema.ts`, `generate.ts`)
- **No promises.** Guarantees, ROI language and committed timescales are
  rejected by the same guard.
- **No published prices by default.** There is no price anywhere on the
  marketing site. The report and PDF carry a "What this would cost" section
  that explains what moves the price and when the fixed figure arrives;
  a range appears there only once you set a real band in `INVESTMENT_BANDS`
  (`src/config/site.ts`). Nothing is ever invented to fill the gap.
- **Marketing consent is separate.** Requesting the report never opts anyone in.
  Consent is stored with its timestamp and the privacy policy version in force.
  (`PRIVACY_POLICY_VERSION` in `src/config/site.ts` — bump it when `/privacy`
  changes.)
- **Scraped websites are data, never instructions.** Public page text is used
  only to understand what a business does. Operational conclusions come from the
  prospect's answers alone.
- **Outbound fetches cannot reach internal networks.** Validation happens at
  connect time through a custom DNS lookup hook, so a name that resolves to a
  private address is refused even if it resolved publicly a moment earlier.
- **Analytics never carries answer text or email addresses.** The server strips
  everything outside a fixed property allow-list.

Changing any of these means changing the tests that assert them.
