import { describe, expect, it } from "vitest";
import { pdfText } from "./helpers/pdfText";
import { pdfFilename, renderReportPdf } from "../src/server/pdf/render";
import { buildFallbackReport } from "../src/server/report/heuristics";
import type { AssessmentAnswers } from "../src/server/validation";

const answers: AssessmentAnswers = {
  company_name: "Riverside Plumbing",
  company_website: "",
  country: "GB",
  employee_range: "5-19",
  respondent_role: "owner",
  respondent_name: "Sam Hall",
  process_problem: "Every job is written on paper, copied into a spreadsheet, then typed again into the invoice.",
  weekly_frequency: "20-50",
  people_involved: "Only our office manager",
  current_tools: ["spreadsheets", "email", "paper"],
  previous_attempts: "We bought a scheduling tool last year but nobody used it.",
  estimated_value: "significant",
  decision_timing: "asap",
  budget_state: "would_find",
};

const PRIORITIES = ["critical", "important", "later"] as const;

describe("PDF rendering", () => {
  it("produces a valid PDF document", async () => {
    const pdf = await renderReportPdf({
      report: buildFallbackReport(answers),
      companyName: "Riverside Plumbing",
      recipientName: "Sam",
      contactEmail: "hello@ibrahemahmed.com",
    });

    expect(pdf.length).toBeGreaterThan(2_000);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdfText(pdf)).toContain("%%EOF");
  });

  it("carries the company name and generation date in the document metadata", async () => {
    const pdf = await renderReportPdf({
      report: buildFallbackReport(answers),
      companyName: "Riverside Plumbing",
      recipientName: "Sam",
      generatedAt: new Date("2026-03-04T10:00:00Z"),
      contactEmail: "hello@ibrahemahmed.com",
    });

    const text = pdfText(pdf);
    expect(text).toContain("Systems Report");
    expect(text).toContain("Riverside Plumbing");
  });

  it("paginates long reports rather than clipping them", async () => {
    const base = buildFallbackReport(answers);
    const long = {
      ...base,
      findings: Array.from({ length: 6 }, (_, index) => ({
        title: `Finding number ${index + 1}`,
        evidence: "You said: ".concat("this happens over and over again. ".repeat(12)),
        business_effect: "The effect compounds. ".repeat(14),
        priority: PRIORITIES[index % 3],
      })),
      questions_for_call: Array.from({ length: 6 }, (_, index) => `Question ${index + 1}: ${"detail ".repeat(20)}`),
      assumptions: Array.from({ length: 6 }, (_, index) => `Assumption ${index + 1}: ${"context ".repeat(18)}`),
    };

    const pdf = await renderReportPdf({
      report: long,
      companyName: "Riverside Plumbing",
      recipientName: "Sam",
      contactEmail: "hello@ibrahemahmed.com",
    });

    const pageCount = (pdfText(pdf).match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pageCount).toBeGreaterThan(1);
    expect(pdfText(pdf)).toContain("Page 1 of");
  });

  it("includes a booking URL as a real link when one is configured", async () => {
    const pdf = await renderReportPdf({
      report: buildFallbackReport(answers),
      companyName: "Riverside Plumbing",
      recipientName: "Sam",
      bookingUrl: "https://cal.example.com/teardown",
      contactEmail: "hello@ibrahemahmed.com",
    });

    expect(pdfText(pdf)).toContain("cal.example.com/teardown");
  });

  it("falls back to the contact email when no booking URL exists", async () => {
    const pdf = await renderReportPdf({
      report: buildFallbackReport(answers),
      companyName: "Riverside Plumbing",
      recipientName: "Sam",
      contactEmail: "hello@ibrahemahmed.com",
    });

    expect(pdfText(pdf)).toContain("hello@ibrahemahmed.com");
    expect(pdfText(pdf)).not.toContain("cal.example.com");
  });

  it("handles a company name with characters that would break a filename", () => {
    expect(pdfFilename("Riverside Plumbing & Heating Ltd.")).toBe("systems-report-riverside-plumbing-heating-ltd.pdf");
    expect(pdfFilename("////")).toBe("systems-report-business.pdf");
    expect(pdfFilename("")).toBe("systems-report-business.pdf");
  });
});
