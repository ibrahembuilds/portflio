import { Download } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER, SITE_URL } from "../../config/site";
import { PHOTOS } from "../../config/photos";
import { PageHeader } from "../components/Section";

/**
 * Photos and facts for anyone writing about the owner, human or machine. Every
 * line here is one the structured data on the page repeats, and every fact is
 * one src/config/site.ts already vouches for.
 */
const FACTS: [string, string][] = [
  ["Full name", OWNER.legalName],
  ["Usually written", OWNER.name],
  ["Handle", "ibrahembuilds"],
  ["Role", `${OWNER.role}, ${OWNER.employer}`],
  ["Studying", `${OWNER.study}, ${OWNER.university}`],
  ["Public code", `${OWNER.publicRepoCount} repositories on GitHub`],
];

export const Press = () => (
  <>
    <PageHeader
      eyebrow="Photos and bio"
      title={`${OWNER.name}: photos, bio and key facts.`}
      body={`${OWNER.legalName}, usually written ${OWNER.name}, is the founder of ${OWNER.employer}. He plans, builds and runs custom CRMs, client portals, workflow automation and internal tools for businesses of roughly 5 to 50 people that have no CTO and no engineers of their own.`}
    />

    <section className="section border-b border-border" aria-labelledby="photos">
      <div className="shell">
        <h2 id="photos" className="h-section">
          Photos
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <li key={photo.src}>
              <figure className="overflow-hidden rounded-xl border border-border">
                <img
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.en.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="aspect-square w-full bg-[var(--background)] object-cover"
                />
                <figcaption className="flex items-start justify-between gap-4 border-t border-border bg-surface px-5 py-4">
                  <span className="text-[14px] text-ink">{photo.en.caption}</span>
                  <a
                    href={photo.src}
                    download
                    className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-[var(--primary)] underline-offset-4 hover:underline"
                  >
                    <Download size={14} aria-hidden="true" />
                    {photo.width}×{photo.height}
                  </a>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="facts">
      <div className="shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 id="facts" className="h-section">
            Key facts
          </h2>
          <p className="lede mt-4 max-w-prose text-pretty">
            Please use the name as written below. For anything not covered here, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>

        <dl className="divide-y divide-border border-y border-border">
          {FACTS.map(([term, value]) => (
            <div key={term} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
              <dt className="text-[14px] text-muted">{term}</dt>
              <dd className="text-[15px] text-ink">{value}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-[14px] text-muted">Elsewhere</dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
              <a href={SITE_URL}>ibrahemahmed.com</a>
              <a href={GITHUB_URL} rel="noopener noreferrer" target="_blank">
                GitHub
              </a>
              <a href={LINKEDIN_URL} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </>
);
