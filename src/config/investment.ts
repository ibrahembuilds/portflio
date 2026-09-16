import { INVESTMENT_BANDS, PRICE_DRIVERS, PRICING_PROMISE, type DeliveryPath } from "./site";
import { SERVICES } from "./content";

/**
 * The "What this would cost" section.
 *
 * A pure function of published configuration, so the browser, the server and
 * the PDF renderer all read the same definition and cannot drift apart on the
 * one subject where a discrepancy would cost trust.
 *
 * Nothing here is invented. The offer description and what it includes come
 * from the published services; the price range appears only when a real band
 * has been set in src/config/site.ts. With no band configured the section still
 * has value — it says what moves the price and when the real number arrives —
 * which is more honest than a guess and more useful than silence.
 */

export type InvestmentSection = {
  /** The offer this looks like, in plain words. */
  offer: string;
  offerName: string;
  /** What that offer includes — the published deliverables, not a sales list. */
  included: string[];
  /** Only present once a real band is configured. */
  range: string | null;
  rangeNote: string | null;
  drivers: string[];
  promise: string;
  /** Always shown. A range is not a quote and must never read as one. */
  disclaimer: string;
};

const PATH_TO_SERVICE: Record<DeliveryPath, string | null> = {
  systems_teardown: "systems-teardown",
  automation_sprint: "automation-sprint",
  core_system_build: "core-system-build",
  unclear: null,
};

const PATH_SUMMARY: Record<DeliveryPath, string> = {
  systems_teardown:
    "The next step is the Teardown itself. It is the only thing worth pricing until the process has been walked through properly.",
  automation_sprint:
    "From what you described this looks like an Automation Sprint: connecting the tools you already pay for so the repeated copying and chasing stops.",
  core_system_build:
    "From what you described this looks like a Core System Build: one operational system built around the process you described.",
  unclear:
    "There is not enough detail yet to say which kind of work this needs, so there is nothing honest to price. That is what the call is for.",
};

const DISCLAIMER_WITH_RANGE =
  "This is a starting range for work of this shape, not a quote for your business. Your fixed price is agreed after the 20-minute call, once the scope is defined.";

const DISCLAIMER_WITHOUT_RANGE =
  "No figure is published here, because a price given before the process has been seen is a guess. You get one fixed price after the 20-minute call, and you approve it before anything is built.";

export const buildInvestmentSection = (path: DeliveryPath): InvestmentSection => {
  const serviceId = PATH_TO_SERVICE[path];
  const service = serviceId ? SERVICES.find((item) => item.id === serviceId) : undefined;
  const band = INVESTMENT_BANDS[path];

  return {
    offer: PATH_SUMMARY[path],
    offerName: service?.name ?? "To be decided on the call",
    included: service?.deliverables ?? [],
    range: band?.range ?? null,
    rangeNote: band?.note ?? null,
    drivers: PRICE_DRIVERS,
    promise: PRICING_PROMISE,
    disclaimer: band ? DISCLAIMER_WITH_RANGE : DISCLAIMER_WITHOUT_RANGE,
  };
};
