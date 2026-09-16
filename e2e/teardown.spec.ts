import { expect, test, type Page } from "@playwright/test";

/**
 * The full conversion path, run against the real API handlers.
 *
 * No database, model provider or email provider is configured for the E2E run,
 * which is deliberate: it exercises the degraded paths the application must
 * survive in production, and proves the prospect still gets a complete report.
 */

const PROBLEM =
  "Every new job gets written on a paper job sheet, then typed into the spreadsheet, then typed again into the invoice. Things get missed and we chase customers twice.";

/** Walks the assessment from the landing page to the preview. */
const completeAssessment = async (page: Page, options: { website?: string } = {}) => {
  await page.goto("/audit/");
  await page.getByRole("button", { name: "Start the Teardown" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toContainText("What's the name of your business?");
  await page.getByLabel("What's the name of your business?").or(page.locator("#company_name")).fill("Riverside Plumbing");
  await page.getByRole("button", { name: "Continue" }).click();

  // Website is optional.
  if (options.website) {
    await page.locator("#company_website").fill(options.website);
    await page.getByRole("button", { name: "Continue" }).click();
  } else {
    await page.getByRole("button", { name: "Skip" }).click();
  }

  await page.locator("#country").selectOption("GB");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("radio", { name: /5–19 people/ }).check();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("radio", { name: "Owner", exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#respondent_name").fill("Sam Hall");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#process_problem").fill(PROBLEM);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("radio", { name: /20 to 50 times a week/ }).check();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#people_involved").fill("Only our office manager");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("checkbox", { name: "Spreadsheets" }).check();
  await page.getByRole("checkbox", { name: "Email inbox" }).check();
  await page.getByRole("checkbox", { name: "Paper or whiteboard" }).check();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#previous_attempts").fill("We bought a scheduling tool last year but nobody used it.");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("radio", { name: /It's costing us work or customers/ }).check();
  await page.getByRole("button", { name: "See what I found" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/areas? worth reviewing/, { timeout: 15_000 });
};

const submitEmail = async (page: Page, email = "sam@riverside.example") => {
  await page.getByRole("button", { name: "Get the full report" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Where should I send the full report?");

  await page.locator("#first_name").fill("Sam");
  await page.locator("#email").fill(email);
  await page.getByRole("button", { name: "Send my full report" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Systems Report", { timeout: 60_000 });
};

test.describe("Systems Teardown", () => {
  test("landing page states the offer and does not gate on email", async ({ page }) => {
    await page.goto("/audit/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Find where your business is losing time, dropping work or depending too heavily on manual processes.",
    );
    await expect(
      page.getByText(
        "Answer a few questions about how your team works. I'll turn the answers into a preliminary Systems Report showing what looks worth fixing first.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Takes a few minutes. No technical knowledge required.")).toBeVisible();

    // No email field before any effort has been invested.
    await expect(page.locator('input[type="email"]')).toHaveCount(0);

    // And it is never publicly called an AI audit.
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const phrase of ["ai audit", "ai consultant", "automation ai score", "ai business advisor", "ai score"]) {
      expect(text, `"${phrase}" appears on the landing page`).not.toContain(phrase);
    }
  });

  test("marketing site hands off to the assessment", async ({ page }) => {
    await page.goto("/");
    const href = await page.getByRole("link", { name: "Start a Systems Teardown" }).first().getAttribute("href");
    expect(href).toBe("https://audit.ibrahemahmed.com");

    // Same app, reached by path in this environment.
    await page.goto("/audit/");
    await expect(page.getByRole("button", { name: "Start the Teardown" })).toBeVisible();
  });

  test("full funnel: assessment, preview, email capture, report, PDF and booking", async ({ page }) => {
    await completeAssessment(page);

    // Preview is limited: a count and short findings, no full report yet.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Your preliminary analysis found \d+ areas? worth reviewing\./,
    );
    await expect(page.getByText("Where work is leaking")).toHaveCount(0);

    await submitEmail(page);

    // Every required report section is on screen.
    for (const section of [
      "Business snapshot",
      "Process reviewed",
      "Where work is leaking",
      "Priority map",
      "Recommended first fix",
      "Example future workflow",
      "How Ibrahem may be able to help",
      "Questions to resolve during the Teardown",
      "Assumptions",
      "Next step",
    ]) {
      await expect(page.getByRole("heading", { name: section, exact: true })).toBeVisible();
    }

    // Report footer identifies the author, as it must when forwarded internally.
    const footer = await page.locator("article footer").innerText();
    expect(footer).toContain("Ibrahem Ahmed");
    expect(footer).toContain("Internal Systems for Small Businesses");
    expect(footer).toContain("ibrahemahmed.com");

    // It says plainly that it is preliminary.
    const body = await page.locator("article").innerText();
    expect(body.toLowerCase()).toContain("preliminary");

    // Qualified lead gets the booking CTA pointed at the configured URL.
    const booking = page.getByRole("link", { name: "Continue with a 20-minute Systems Teardown" }).first();
    await expect(booking).toBeVisible();
    await expect(booking).toHaveAttribute("href", "https://example.com/book-teardown");

    // PDF download returns a real PDF.
    const pdfHref = await page.getByRole("link", { name: "Download PDF" }).getAttribute("href");
    expect(pdfHref).toContain("/api/audit/report-pdf");

    const pdfResponse = await page.request.get(pdfHref!);
    expect(pdfResponse.status()).toBe(200);
    expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");
    const pdf = await pdfResponse.body();
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(2_000);
    expect(pdfResponse.headers()["content-disposition"]).toContain("systems-report-riverside-plumbing.pdf");
  });

  test("the report never states a figure the prospect did not give", async ({ page }) => {
    await completeAssessment(page);
    await submitEmail(page);

    const text = await page.locator("article").innerText();
    expect(text).not.toMatch(/[$£€]\s?\d/);
    expect(text).not.toMatch(/\b\d+\s?%/);
    expect(text).not.toMatch(/\b\d+\s+hours?\s+(?:a week|per week|saved)/i);
    expect(text.toLowerCase()).not.toContain("guarantee");
    expect(text.toLowerCase()).not.toContain("roi");
  });

  test("a report link is useless without its token", async ({ page }) => {
    await completeAssessment(page);
    await submitEmail(page);

    const pdfHref = await page.getByRole("link", { name: "Download PDF" }).getAttribute("href");
    const leadId = new URL(pdfHref!, "http://localhost").searchParams.get("id")!;

    const withoutToken = await page.request.get(`/api/audit/report?id=${leadId}`);
    expect(withoutToken.status()).toBe(400);

    const wrongToken = await page.request.get(`/api/audit/report?id=${leadId}&t=guessed`);
    expect(wrongToken.status()).toBe(404);

    const wrongPdf = await page.request.get(`/api/audit/report-pdf?id=${leadId}&t=guessed`);
    expect(wrongPdf.status()).toBe(404);
  });

  test("the report reopens from its link after the page is closed", async ({ page }) => {
    await completeAssessment(page);
    await submitEmail(page);

    const pdfHref = await page.getByRole("link", { name: "Download PDF" }).getAttribute("href");
    const params = new URL(pdfHref!, "http://localhost").searchParams;

    await page.goto(`/audit/?report=${params.get("id")}&t=${params.get("t")}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Systems Report");
    await expect(page.getByText("Riverside Plumbing").first()).toBeVisible();
  });

  test("marketing consent is separate and off by default", async ({ page }) => {
    await completeAssessment(page);
    await page.getByRole("button", { name: "Get the full report" }).click();

    const consent = page.getByRole("checkbox", {
      name: /Send me occasional practical ideas about improving business systems/,
    });
    await expect(consent).toBeVisible();
    await expect(consent).not.toBeChecked();

    // The submit button asks for the report, not for a subscription.
    await expect(page.getByRole("button", { name: "Send my full report" })).toBeVisible();
  });

  test("validation blocks an empty required answer and announces why", async ({ page }) => {
    await page.goto("/audit/");
    await page.getByRole("button", { name: "Start the Teardown" }).click();

    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("This one's needed to continue.")).toBeVisible();
    await expect(page.locator("#company_name")).toHaveAttribute("aria-invalid", "true");

    await page.locator("#company_name").fill("Riverside Plumbing");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Do you have a website?");
  });

  test("a too-short process description is rejected with a helpful message", async ({ page }) => {
    await page.goto("/audit/");
    await page.getByRole("button", { name: "Start the Teardown" }).click();

    await page.locator("#company_name").fill("Riverside Plumbing");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Skip" }).click();
    await page.locator("#country").selectOption("GB");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: /5–19 people/ }).check();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: "Owner", exact: true }).check();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("#respondent_name").fill("Sam Hall");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.locator("#process_problem").fill("Too slow");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/more detail would help/i)).toBeVisible();
  });

  test("progress is visible and back navigation preserves answers", async ({ page }) => {
    await page.goto("/audit/");
    await page.getByRole("button", { name: "Start the Teardown" }).click();

    const progress = page.getByRole("progressbar");
    await expect(progress).toHaveAttribute("aria-valuenow", "1");

    await page.locator("#company_name").fill("Riverside Plumbing");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(progress).toHaveAttribute("aria-valuenow", "2");

    await page.getByRole("button", { name: "Back" }).click();
    await expect(progress).toHaveAttribute("aria-valuenow", "1");
    await expect(page.locator("#company_name")).toHaveValue("Riverside Plumbing");
  });

  test("answers survive a page refresh", async ({ page }) => {
    await page.goto("/audit/");
    await page.getByRole("button", { name: "Start the Teardown" }).click();
    await page.locator("#company_name").fill("Riverside Plumbing");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.reload();

    await page.getByRole("button", { name: "Pick up where I left off" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Do you have a website?");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.locator("#company_name")).toHaveValue("Riverside Plumbing");
  });

  test("the whole first screen is operable from the keyboard", async ({ page }) => {
    await page.goto("/audit/");
    await page.getByRole("button", { name: "Start the Teardown" }).click();

    // Focus lands on the first control without a click.
    await expect(page.locator("#company_name")).toBeFocused();

    await page.keyboard.type("Riverside Plumbing");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Do you have a website?");

    await page.keyboard.press("Alt+ArrowLeft");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("What's the name of your business?");
  });

  test("a hostile website URL is refused and the assessment carries on", async ({ page }) => {
    const blocked = await page.request.post("/api/audit/website", {
      data: { session_id: "3f2504e0-4f89-41d3-9a0c-0305e82c3301", url: "http://169.254.169.254/latest/meta-data/" },
    });
    expect(blocked.status()).toBe(200);
    expect(await blocked.json()).toEqual({ ok: false });

    for (const url of ["file:///etc/passwd", "http://localhost:6379/", "http://127.0.0.1/"]) {
      const response = await page.request.post("/api/audit/website", {
        data: { session_id: "3f2504e0-4f89-41d3-9a0c-0305e82c3301", url },
      });
      expect(await response.json()).toEqual({ ok: false });
    }

    // A website that cannot be read never stops the funnel.
    await completeAssessment(page, { website: "definitely-not-a-real-domain-xyz.invalid" });
    await submitEmail(page, "sam2@riverside.example");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Systems Report");
  });

  // Rate limiting itself is covered in tests/ratelimit.test.ts: the counter is
  // keyed by client address over an hour-long window, so a browser suite would
  // exhaust its own shared bucket rather than prove anything.
  test("the API rejects a malformed submission with field-level errors", async ({ page }) => {
    const response = await page.request.post("/api/audit/lead", {
      data: {
        session_id: "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
        first_name: "Sam",
        email: "not-an-email",
        answers: { company_name: "X" },
        consent: { privacy_policy_version: "2026-09-15" },
        attribution: {},
      },
    });

    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.error).toBe("invalid_submission");
    expect(body.details).toHaveProperty("email");
  });

  test("the admin lead view refuses access without the token", async ({ page }) => {
    const response = await page.request.get("/api/admin/leads");
    // 503 when no admin token is configured, 401 when one is and it is missing.
    expect([401, 503]).toContain(response.status());
  });

  test("the assessment works on a phone without sideways scroll", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/audit/");
    await page.getByRole("button", { name: "Start the Teardown" }).click();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflows).toBe(false);

    // Inputs are at least 16px so iOS does not zoom on focus.
    const fontSize = await page.locator("#company_name").evaluate((node) => getComputedStyle(node).fontSize);
    expect(Number.parseFloat(fontSize)).toBeGreaterThanOrEqual(16);
  });
});
