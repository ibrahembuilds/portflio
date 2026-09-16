import { describe, expect, it } from "vitest";
import { assessFit, describesSpecificProblem, TARGET_COUNTRIES } from "../src/server/qualification";
import type { AssessmentAnswers } from "../src/server/validation";

const REAL_PROBLEM =
  "Every new job gets written on a paper job sheet, then typed into the spreadsheet, then typed again into the invoice. Things get missed.";

const baseAnswers = (overrides: Partial<AssessmentAnswers> = {}): AssessmentAnswers => ({
  company_name: "Riverside Plumbing",
  company_website: "",
  country: "GB",
  employee_range: "5-19",
  respondent_role: "owner",
  respondent_name: "Sam Hall",
  process_problem: REAL_PROBLEM,
  weekly_frequency: "20-50",
  people_involved: "Office manager",
  current_tools: ["spreadsheets", "email"],
  previous_attempts: "",
  estimated_value: "meaningful",
  ...overrides,
});

describe("describesSpecificProblem", () => {
  it("accepts a described process", () => {
    expect(describesSpecificProblem(REAL_PROBLEM)).toBe(true);
  });

  it("rejects something too short to map", () => {
    expect(describesSpecificProblem("It's a mess")).toBe(false);
    expect(describesSpecificProblem("")).toBe(false);
  });

  it("rejects padding that meets the length but says nothing", () => {
    expect(describesSpecificProblem("bad bad bad bad bad bad bad bad bad bad bad bad")).toBe(false);
    expect(describesSpecificProblem("a".repeat(120))).toBe(false);
  });

  it("accepts a short but genuinely specific description", () => {
    expect(describesSpecificProblem("We lose leads because nobody answers the phone when we are out on jobs")).toBe(
      true,
    );
  });
});

describe("assessFit", () => {
  it("marks a lead qualified when all four criteria are met", () => {
    const fit = assessFit(baseAnswers());
    expect(fit.status).toBe("qualified");
    expect(fit.metCount).toBe(4);
    expect(fit.criteria).toEqual({ employeeRange: true, geography: true, role: true, specificProblem: true });
  });

  it("treats 20–50 as in range and 51–200 as out", () => {
    expect(assessFit(baseAnswers({ employee_range: "20-50" })).criteria.employeeRange).toBe(true);
    expect(assessFit(baseAnswers({ employee_range: "51-200" })).criteria.employeeRange).toBe(false);
    expect(assessFit(baseAnswers({ employee_range: "1-4" })).criteria.employeeRange).toBe(false);
  });

  it("drops to potential when exactly one criterion is missing", () => {
    expect(assessFit(baseAnswers({ employee_range: "1-4" })).status).toBe("potential");
    expect(assessFit(baseAnswers({ respondent_role: "other" })).status).toBe("potential");
    expect(assessFit(baseAnswers({ country: "OTHER" })).status).toBe("potential");
  });

  it("is not a current fit when two or more criteria are missing", () => {
    const fit = assessFit(baseAnswers({ employee_range: "200+", respondent_role: "other" }));
    expect(fit.status).toBe("not_current_fit");
    expect(fit.metCount).toBe(2);
  });

  it("accepts every decision-making role and rejects the catch-all", () => {
    for (const role of ["owner", "founder", "operations", "general_manager"]) {
      expect(assessFit(baseAnswers({ respondent_role: role })).criteria.role).toBe(true);
    }
    expect(assessFit(baseAnswers({ respondent_role: "other" })).criteria.role).toBe(false);
  });

  it("covers the stated target geographies", () => {
    for (const country of ["US", "GB", "AU", "CA", "DE", "IE", "SA", "AE"]) {
      expect(TARGET_COUNTRIES.has(country)).toBe(true);
    }
    expect(TARGET_COUNTRIES.has("OTHER")).toBe(false);
  });

  it("does not qualify a lead whose problem is unusable, however good the rest is", () => {
    const fit = assessFit(baseAnswers({ process_problem: "everything everything everything everything" }));
    expect(fit.criteria.specificProblem).toBe(false);
    expect(fit.status).toBe("potential");
  });
});
