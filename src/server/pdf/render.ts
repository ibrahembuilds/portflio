import PDFDocument from "pdfkit";
import { LINKEDIN_URL, OWNER, SITE_URL } from "../../config/site";
import { buildInvestmentSection } from "../../config/investment";
import { PRIORITY_LABEL, PRIORITY_ORDER, type SystemsReport } from "../report/schema";

/**
 * Server-side PDF rendering.
 *
 * pdfkit was chosen over a headless-browser renderer because a browser binary
 * on a serverless function costs tens of megabytes and a multi-second cold
 * start for a document that is fundamentally a flowing text report. The layout
 * below mirrors the on-screen report section for section and uses the same
 * palette, so the two read as the same document.
 *
 * Typeface note: pdfkit embeds TTF/OTF only, and Geist ships as woff2, so the
 * PDF uses Helvetica. It is the one place the brand face is not used.
 */

/** Mirrors the tokens in src/index.css so the PDF reads as the same document
 *  as the page it came from. ACCENT is a fill that carries dark text — it is
 *  never used for type, and never as a hairline. */
const INK = "#0B1220";
const ACCENT = "#D4F53C";
const PRIMARY = "#0B1220";
const MUTED = "#6B6862";
const BORDER = "#E5E3DC";
const SOFT = "#F1F8D4";

const PAGE_MARGIN = 56;
const FOOTER_HEIGHT = 46;

type Doc = PDFKit.PDFDocument;

const contentWidth = (doc: Doc) => doc.page.width - PAGE_MARGIN * 2;
const bottomLimit = (doc: Doc) => doc.page.height - PAGE_MARGIN - FOOTER_HEIGHT;

/** Starts a new page when a block would not fit, so a heading is never left
 *  stranded at the foot of a page and no section is clipped. */
const ensureSpace = (doc: Doc, needed: number) => {
  if (doc.y + needed > bottomLimit(doc)) doc.addPage();
};

const sectionHeading = (doc: Doc, text: string) => {
  ensureSpace(doc, 64);
  doc.moveDown(0.9);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(text.toUpperCase(), { characterSpacing: 0.6 });
  const y = doc.y + 5;
  doc.moveTo(PAGE_MARGIN, y).lineTo(doc.page.width - PAGE_MARGIN, y).lineWidth(0.75).strokeColor(BORDER).stroke();
  doc.y = y + 11;
};

const body = (doc: Doc, text: string, options: { color?: string; size?: number; indent?: number } = {}) => {
  ensureSpace(doc, 26);
  doc
    .font("Helvetica")
    .fontSize(options.size ?? 10.5)
    .fillColor(options.color ?? INK)
    .text(text, PAGE_MARGIN + (options.indent ?? 0), doc.y, {
      width: contentWidth(doc) - (options.indent ?? 0),
      align: "left",
      lineGap: 2.4,
    });
};

const label = (doc: Doc, text: string) => {
  ensureSpace(doc, 22);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(MUTED).text(text.toUpperCase(), { characterSpacing: 0.5 });
  doc.moveDown(0.15);
};

const definition = (doc: Doc, term: string, value: string) => {
  ensureSpace(doc, 40);
  label(doc, term);
  body(doc, value || "Not answered");
  doc.moveDown(0.5);
};

const bullet = (doc: Doc, text: string, marker = "•") => {
  ensureSpace(doc, 26);
  const startY = doc.y;
  doc.font("Helvetica").fontSize(10.5).fillColor(PRIMARY).text(marker, PAGE_MARGIN, startY, { width: 14 });
  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(INK)
    .text(text, PAGE_MARGIN + 16, startY, { width: contentWidth(doc) - 16, lineGap: 2.2 });
  doc.moveDown(0.28);
};

const priorityColour = (priority: keyof typeof PRIORITY_ORDER) =>
  priority === "critical" ? PRIMARY : priority === "important" ? INK : MUTED;

const findingBlock = (doc: Doc, index: number, finding: SystemsReport["findings"][number]) => {
  ensureSpace(doc, 110);
  const top = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(11.5)
    .fillColor(INK)
    .text(`${index}. ${finding.title}`, PAGE_MARGIN, top, { width: contentWidth(doc) - 96 });

  // Priority chip, right-aligned against the title.
  const chipText = PRIORITY_LABEL[finding.priority];
  doc.font("Helvetica-Bold").fontSize(8);
  const chipWidth = doc.widthOfString(chipText) + 14;
  const chipX = doc.page.width - PAGE_MARGIN - chipWidth;
  doc.roundedRect(chipX, top - 1, chipWidth, 15, 3).fillColor(finding.priority === "critical" ? SOFT : "#F1F3F7").fill();
  doc.fillColor(priorityColour(finding.priority)).text(chipText, chipX, top + 3, { width: chipWidth, align: "center" });

  doc.y = Math.max(doc.y, top + 18);
  doc.moveDown(0.3);

  label(doc, "What this is based on");
  body(doc, finding.evidence, { color: MUTED });
  doc.moveDown(0.35);
  label(doc, "Effect on the business");
  body(doc, finding.business_effect);
  doc.moveDown(0.7);
};

const priorityMap = (doc: Doc, findings: SystemsReport["findings"]) => {
  const groups: Array<[keyof typeof PRIORITY_ORDER, string]> = [
    ["critical", "Fix first"],
    ["important", "Worth fixing"],
    ["later", "Can wait"],
  ];

  for (const [priority, heading] of groups) {
    const items = findings.filter((finding) => finding.priority === priority);
    if (items.length === 0) continue;

    ensureSpace(doc, 50);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(priorityColour(priority)).text(heading);
    doc.moveDown(0.2);
    for (const item of items) bullet(doc, item.title, "—");
    doc.moveDown(0.4);
  }
};

const exampleFlow = (doc: Doc, steps: string[]) => {
  steps.forEach((step, index) => {
    ensureSpace(doc, 30);
    const startY = doc.y;
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(PRIMARY)
      .text(String(index + 1).padStart(2, "0"), PAGE_MARGIN, startY + 1, { width: 20 });
    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor(INK)
      .text(step, PAGE_MARGIN + 24, startY, { width: contentWidth(doc) - 24, lineGap: 2.2 });
    doc.moveDown(0.3);
  });
};

const DELIVERY_PATH_COPY: Record<SystemsReport["likely_delivery_path"], string> = {
  systems_teardown:
    "The next step is the Systems Teardown itself: 20 minutes on one process, then a written map and a fixed quote for the highest-priority fix.",
  automation_sprint:
    "From what you described, this may be an Automation Sprint: connecting the systems you already use so the repeated copying and chasing stops. That is confirmed on the call, not before.",
  core_system_build:
    "From what you described, this may be a Core System Build: one operational system built around the process you described, replacing the spreadsheets and inboxes it currently runs on. That is confirmed on the call, not before.",
  unclear:
    "There is not yet enough detail to say which kind of work this needs. That is exactly what the 20-minute call is for.",
};

export type PdfInput = {
  report: SystemsReport;
  companyName: string;
  recipientName: string;
  generatedAt?: Date;
  bookingUrl?: string;
  contactEmail: string;
};

export const renderReportPdf = (input: PdfInput): Promise<Buffer> => {
  const generatedAt = input.generatedAt ?? new Date();
  const generatedLabel = generatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: PAGE_MARGIN, bottom: PAGE_MARGIN + FOOTER_HEIGHT, left: PAGE_MARGIN, right: PAGE_MARGIN },
    bufferPages: true,
    info: {
      Title: `Systems Report — ${input.companyName}`,
      Author: "Ibrahem Ahmed",
      Subject: "Preliminary Systems Report",
      Creator: "ibrahemahmed.com",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const { report } = input;

  /* Cover block ---------------------------------------------------------- */
  doc.font("Helvetica-Bold").fontSize(26).fillColor(INK).text("Systems Report");
  doc.moveDown(0.25);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(input.companyName);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(`Prepared for ${input.recipientName} · ${generatedLabel}`);

  doc.moveDown(0.8);
  // The accent appears as a field carrying dark text, never as a rule: against
  // paper it is 1.18:1, so a hairline of it would be invisible in print.
  const bannerY = doc.y;
  doc.rect(PAGE_MARGIN, bannerY, contentWidth(doc), 30).fillColor(ACCENT).fill();
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(INK)
    .text("PRELIMINARY SYSTEMS REPORT", PAGE_MARGIN + 12, bannerY + 10, { characterSpacing: 1 });
  doc.y = bannerY + 46;

  doc.font("Helvetica").fontSize(11).fillColor(INK).text(report.executive_summary, {
    width: contentWidth(doc),
    lineGap: 3,
  });

  /* Business snapshot ---------------------------------------------------- */
  sectionHeading(doc, "Business snapshot");
  definition(doc, "Business", report.business_context.business);
  definition(doc, "How often this happens", report.business_context.frequency);
  definition(doc, "Who does it today", report.business_context.people_involved);
  definition(
    doc,
    "Where the work happens now",
    report.business_context.current_tools.length > 0
      ? report.business_context.current_tools.join(", ")
      : "Not answered",
  );

  /* Process reviewed ----------------------------------------------------- */
  sectionHeading(doc, "Process reviewed");
  body(doc, report.business_context.process_reviewed, { color: MUTED });

  /* Findings ------------------------------------------------------------- */
  sectionHeading(doc, "Where work is leaking");
  const ordered = [...report.findings].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  ordered.forEach((finding, index) => findingBlock(doc, index + 1, finding));

  /* Priority map --------------------------------------------------------- */
  sectionHeading(doc, "Priority map");
  priorityMap(doc, ordered);

  /* Recommended first fix ------------------------------------------------ */
  sectionHeading(doc, "Recommended first fix");
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(report.recommended_first_fix.title, {
    width: contentWidth(doc),
  });
  doc.moveDown(0.5);
  label(doc, "Why this one first");
  body(doc, report.recommended_first_fix.reason);
  doc.moveDown(0.5);
  label(doc, "What changes day to day");
  body(doc, report.recommended_first_fix.operational_change);

  /* Example future workflow ---------------------------------------------- */
  sectionHeading(doc, "Example future workflow");
  exampleFlow(doc, report.recommended_first_fix.example_flow);

  /* How Ibrahem may be able to help -------------------------------------- */
  sectionHeading(doc, "How Ibrahem may be able to help");
  body(doc, DELIVERY_PATH_COPY[report.likely_delivery_path]);
  doc.moveDown(0.4);
  body(
    doc,
    "Scope, price and timing are agreed after that conversation, never before. If the right answer turns out to be software you can buy, or a change that needs no software at all, that is what you will be told.",
    { color: MUTED },
  );

  /* What this would cost -------------------------------------------------- */
  const investment = buildInvestmentSection(report.likely_delivery_path);

  sectionHeading(doc, "What this would cost");
  body(doc, investment.offer);
  doc.moveDown(0.5);

  if (investment.range) {
    ensureSpace(doc, 76);
    const boxY = doc.y;
    doc.roundedRect(PAGE_MARGIN, boxY, contentWidth(doc), 58, 5).fillColor(SOFT).fill();
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(MUTED)
      .text(investment.offerName.toUpperCase(), PAGE_MARGIN + 14, boxY + 12, { characterSpacing: 0.5 });
    doc
      .font("Helvetica-Bold")
      .fontSize(17)
      .fillColor(PRIMARY)
      .text(investment.range, PAGE_MARGIN + 14, boxY + 26, { width: contentWidth(doc) - 28 });
    doc.y = boxY + 58;
    doc.moveDown(0.6);
    if (investment.rangeNote) body(doc, investment.rangeNote, { color: MUTED });
    doc.moveDown(0.4);
  }

  if (investment.included.length > 0) {
    label(doc, `What ${investment.offerName} includes`);
    investment.included.forEach((item) => bullet(doc, item, "—"));
    doc.moveDown(0.4);
  }

  label(doc, "What moves the price");
  investment.drivers.forEach((driver) => bullet(doc, driver, "—"));
  doc.moveDown(0.5);

  body(doc, investment.promise);
  doc.moveDown(0.4);
  body(doc, investment.disclaimer, { color: MUTED, size: 9.5 });

  /* Questions for the call ----------------------------------------------- */
  sectionHeading(doc, "Questions to resolve during the Teardown");
  report.questions_for_call.forEach((question) => bullet(doc, question));

  /* Assumptions ---------------------------------------------------------- */
  sectionHeading(doc, "Assumptions");
  if (report.assumptions.length === 0) {
    body(doc, "No assumptions were needed beyond the answers given.", { color: MUTED });
  } else {
    report.assumptions.forEach((assumption) => bullet(doc, assumption, "—"));
  }

  /* Next step ------------------------------------------------------------ */
  sectionHeading(doc, "Next step");
  body(doc, report.next_step);
  doc.moveDown(0.7);

  /* Contact block --------------------------------------------------------- */
  ensureSpace(doc, 120);
  const cardY = doc.y;
  const cardHeight = input.bookingUrl ? 112 : 96;
  doc.roundedRect(PAGE_MARGIN, cardY, contentWidth(doc), cardHeight, 5).fillColor(SOFT).fill();
  doc.rect(PAGE_MARGIN, cardY, 4, cardHeight).fillColor(ACCENT).fill();

  const cardLeft = PAGE_MARGIN + 18;
  const cardWidth = contentWidth(doc) - 32;

  doc.font("Helvetica-Bold").fontSize(12).fillColor(INK).text(OWNER.name, cardLeft, cardY + 14, { width: cardWidth });
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor(MUTED)
    .text(OWNER.discipline, cardLeft, cardY + 30, { width: cardWidth });

  let lineY = cardY + 48;
  const contactLine = (text: string, link?: string) => {
    doc
      .font(link ? "Helvetica-Bold" : "Helvetica")
      .fontSize(10)
      .fillColor(link ? PRIMARY : INK)
      .text(text, cardLeft, lineY, { width: cardWidth, link, underline: false, lineBreak: false });
    lineY += 15;
  };

  if (input.bookingUrl) contactLine(`Book the 20-minute call: ${input.bookingUrl}`, input.bookingUrl);
  contactLine(input.contactEmail, `mailto:${input.contactEmail}`);
  contactLine(SITE_URL.replace(/^https?:\/\//, ""), SITE_URL);
  contactLine(LINKEDIN_URL.replace(/^https?:\/\/(www\.)?/, ""), LINKEDIN_URL);

  doc.y = cardY + cardHeight;
  doc.moveDown(0.8);
  ensureSpace(doc, 60);
  const noteY = doc.y;
  doc.roundedRect(PAGE_MARGIN, noteY, contentWidth(doc), 46, 4).fillColor("#F4F6FA").fill();
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(MUTED)
    .text(
      "This report is preliminary. It is built from a short set of answers and has not been checked against how the work actually runs. It is a starting point for a 20-minute conversation, not an operational review.",
      PAGE_MARGIN + 12,
      noteY + 10,
      { width: contentWidth(doc) - 24, lineGap: 1.6 },
    );

  /* Footers -------------------------------------------------------------- */
  const range = doc.bufferedPageRange();
  for (let index = 0; index < range.count; index += 1) {
    doc.switchToPage(range.start + index);
    const footerY = doc.page.height - PAGE_MARGIN - 26;

    doc
      .moveTo(PAGE_MARGIN, footerY - 10)
      .lineTo(doc.page.width - PAGE_MARGIN, footerY - 10)
      .lineWidth(0.75)
      .strokeColor(BORDER)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(INK)
      .text("Ibrahem Ahmed", PAGE_MARGIN, footerY, { width: contentWidth(doc) / 2, lineBreak: false });
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(MUTED)
      .text("Internal Systems for Small Businesses · ibrahemahmed.com", PAGE_MARGIN, footerY + 11, {
        width: contentWidth(doc) / 2,
        lineBreak: false,
      });

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(MUTED)
      .text(`${input.companyName} · ${generatedLabel} · Page ${index + 1} of ${range.count}`, PAGE_MARGIN, footerY + 5, {
        width: contentWidth(doc),
        align: "right",
      });
  }

  doc.flushPages();
  doc.end();
  return done;
};

export const pdfFilename = (companyName: string): string => {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `systems-report-${slug || "business"}.pdf`;
};

