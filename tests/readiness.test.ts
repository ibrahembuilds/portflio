import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { assessReadiness } from "../src/server/qualification";
import { buildNextAction } from "../src/server/submitLead";
import { buildInvestmentSection } from "../src/config/investment";
import { INVESTMENT_BANDS, PRICE_DRIVERS, hasPublishedPricing } from "../src/config/site";
import type { AssessmentAnswers } from "../src/server/validation";

const answers = (timing: string, budget: string): AssessmentAnswers =>
  ({
    company_name: "Riverside Plumbing",
    company_website: "",
    country: "GB",
    employee_range: "5-19",
    respondent_role: "owner",
    respondent_name: "Sam Hall",
    process_problem: "Every job is written on paper, copied into a spreadsheet, then typed into the invoice.",
    weekly_frequency: "20-50",
    people_involved: "Office manager",
    current_tools: ["spreadsheets"],
    previous_attempts: "",
    estimated_value: "significant",
    decision_timing: timing,
    budget_state: budget,
  }) as AssessmentAnswers;

describe("assessReadiness", () => {
  it("is ready when the owner wants it soon and can pay for it", () => {
    expect(assessReadiness(answers("asap", "allocated"))).toBe("ready");
    expect(assessReadiness(answers("asap", "would_find"))).toBe("ready");
    expect(assessReadiness(answers("1-3-months", "allocated"))).toBe("ready");
  });

  it("is exploring when only one of the two holds", () => {
    expect(assessReadiness(answers("asap", "needs_number"))).toBe("exploring");
    expect(assessReadiness(answers("3-6-months", "allocated"))).toBe("exploring");
    expect(assessReadiness(answers("exploring", "would_find"))).toBe("exploring");
  });

  it("is early only when there is no date and no money", () => {
    expect(assessReadiness(answers("exploring", "none"))).toBe("early");
    // Wanting it now with no budget is still worth a conversation.
    expect(assessReadiness(answers("asap", "none"))).toBe("exploring");
  });
});

describe("next action across fit and readiness", () => {
  beforeEach(() => {
    process.env.SYSTEMS_TEARDOWN_BOOKING_URL = "https://cal.example.com/teardown";
  });
  afterEach(() => {
    delete process.env.SYSTEMS_TEARDOWN_BOOKING_URL;
  });

  it("asks directly for the call when the lead is qualified and ready", () => {
    const action = buildNextAction("qualified", "ready");
    expect(action.kind).toBe("book");
    if (action.kind === "book") {
      expect(action.label).toBe("Continue with a 20-minute Systems Teardown");
      expect(action.url).toBe("https://cal.example.com/teardown");
    }
  });

  it("softens the ask for a qualified lead who is still exploring", () => {
    const action = buildNextAction("qualified", "exploring");
    expect(action.kind).toBe("book");
    if (action.kind === "book") expect(action.label).toBe("Book a 20-minute call");
  });

  it("withholds the booking link entirely when there is no date and no budget", () => {
    const action = buildNextAction("qualified", "early");
    expect(action.kind).toBe("no_pitch");
    expect(action.heading).toBe("No call needed yet");
    // A good business at the wrong moment is kept, not pitched at.
    expect(JSON.stringify(action)).not.toContain("cal.example.com");
  });

  it("still declines to claim a fit for a lead that is not one, however ready", () => {
    const action = buildNextAction("not_current_fit", "ready");
    expect(action.kind).toBe("no_pitch");
    expect(action.body).toContain("probably not the right person");
  });
});

describe("investment section", () => {
  it("ships with no price band configured, so nothing is invented", () => {
    expect(hasPublishedPricing()).toBe(false);
    expect(Object.values(INVESTMENT_BANDS).every((band) => band === null)).toBe(true);
  });

  it("still says something useful with no band set", () => {
    const section = buildInvestmentSection("automation_sprint");

    expect(section.range).toBeNull();
    expect(section.offerName).toBe("Automation Sprint");
    expect(section.drivers).toEqual(PRICE_DRIVERS);
    expect(section.included.length).toBeGreaterThan(0);
    expect(section.promise).toContain("one fixed price");
    expect(section.disclaimer).toContain("a price given before the process has been seen is a guess");
  });

  it("publishes what the offer includes from the real service definition", () => {
    const section = buildInvestmentSection("core_system_build");
    expect(section.offerName).toBe("Core System Build");
    expect(section.included.join(" ")).toContain("Deployed on accounts in your name");
  });

  it("says plainly that nothing can be priced when the path is unclear", () => {
    const section = buildInvestmentSection("unclear");
    expect(section.offerName).toBe("To be decided on the call");
    expect(section.offer).toContain("nothing honest to price");
    expect(section.included).toEqual([]);
  });

  it("never states a figure anywhere while the bands are unset", () => {
    for (const path of ["systems_teardown", "automation_sprint", "core_system_build", "unclear"] as const) {
      const text = JSON.stringify(buildInvestmentSection(path));
      expect(text, path).not.toMatch(/[$£€]\s?\d/);
    }
  });
});
