import { expect, test } from "@playwright/test";

/**
 * The marketing site is prerendered static HTML, so these assertions run against
 * exactly what a crawler and a first-time visitor receive.
 */

test.describe("marketing site", () => {
  test("homepage leads with the positioning and the primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Your business shouldn't depend on spreadsheets, inboxes and someone's memory\./,
    );
    await expect(page.getByText(/I build custom CRMs, client portals, workflow automation and internal tools/)).toBeVisible();

    // Primary CTA points at the assessment, not at a contact form.
    const cta = page.getByRole("link", { name: "Start a Systems Teardown" }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "https://audit.ibrahemahmed.com");

    await expect(page.getByRole("link", { name: "See what I build" })).toHaveAttribute("href", "/work");
  });

  test("homepage carries the required sections in order", async ({ page }) => {
    await page.goto("/");

    const headings = await page.locator("main h2").allInnerTexts();
    const joined = headings.join(" | ");

    expect(joined).toContain("Most owners don't describe this as a software problem.");
    expect(joined).toContain("One system your team opens instead of five tabs.");
    expect(joined).toContain("Four steps. No open-ended engagements.");
    expect(joined).toContain("Systems that are live, and code you can read.");
    expect(joined).toContain("Find out what is worth fixing before you spend anything.");
    expect(joined).toContain("Questions owners ask.");
  });

  test("problem recognition uses owner language, not technical language", async ({ page }) => {
    await page.goto("/");

    for (const quote of [
      "My team is copying the same information between three different tools.",
      "We lose leads because nobody answers fast enough.",
      "Our client onboarding is 14 emails and a PDF.",
      "Only one person knows how this works and they're on holiday.",
    ]) {
      await expect(page.getByText(quote, { exact: false })).toBeVisible();
    }
  });

  test("no banned positioning language anywhere on the site", async ({ page }) => {
    const banned = [
      "AI consultant",
      "AI expert",
      "passionate about AI",
      "full-stack developer",
      "AI-powered",
      "cutting-edge",
      "digital transformation",
      "seamless",
      "leverage",
      "synergy",
      "next-generation",
      "revolutionary",
      "intelligent automation",
    ];

    for (const path of ["/", "/services", "/how-it-works", "/work", "/about", "/ar/", "/ar/services/"]) {
      await page.goto(path);
      const text = (await page.locator("body").innerText()).toLowerCase();
      for (const phrase of banned) {
        expect(text, `"${phrase}" found on ${path}`).not.toContain(phrase.toLowerCase());
      }
      // Never imply a team.
      expect(text, `"we build" found on ${path}`).not.toContain("we build");
    }
  });

  test("no fabricated proof: no prices, percentages or client counts", async ({ page }) => {
    for (const path of ["/", "/services", "/how-it-works", "/work", "/about"]) {
      await page.goto(path);

      // Owner quotes are excluded: "We pay for software that does 20% of what
      // we need" is a customer's own words, not a claim the site is making.
      const text = await page.locator("main").evaluate((main) => {
        const clone = main.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("blockquote").forEach((node) => node.remove());
        return clone.innerText ?? clone.textContent ?? "";
      });

      expect(text, `currency figure on ${path}`).not.toMatch(/[$£€]\s?\d/);
      expect(text, `percentage claim on ${path}`).not.toMatch(/\b\d+\s?%/);
      expect(text, `hours-saved claim on ${path}`).not.toMatch(/\b\d+\+?\s*(hours|hrs)\s+(saved|per|a)\b/i);
      expect(text, `30-day guarantee on ${path}`).not.toMatch(/30[- ]day guarantee/i);
      expect(text.toLowerCase(), `testimonial marker on ${path}`).not.toContain("clients served");
    }
  });

  test("services page lists exactly the four offers with no pricing", async ({ page }) => {
    await page.goto("/services");

    for (const id of ["systems-teardown", "core-system-build", "automation-sprint", "care-plan"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    const text = await page.locator("main").innerText();
    expect(text).toContain("I don't publish prices for work I haven't scoped.");
    expect(text).not.toMatch(/[$£€]\s?\d/);

    // The Teardown is the only offer with its own CTA.
    await expect(page.locator("#systems-teardown").getByRole("link", { name: /Start a Systems Teardown/ })).toBeVisible();
  });

  test("how it works shows the four-step framework verbatim", async ({ page }) => {
    await page.goto("/how-it-works");
    const text = await page.locator("main").innerText();

    expect(text).toContain("I spend 20 minutes on what you actually do, not what you want built.");
    expect(text).toContain("Fixed scope, fixed price, fixed date. If I can't fix it, I tell you and we stop.");
    expect(text).toContain("You see it working in week one, not at the end.");
    expect(text).toContain("Your data, your accounts, your documentation. No lock-in.");
  });

  test("work page shows only openable proof", async ({ page }) => {
    await page.goto("/work");

    await expect(page.getByRole("link", { name: /ncase\.com\.sa/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /github\.com\/ibrahembuilds/ }).first()).toBeVisible();
    await expect(page.getByText("22 repositories you can read.")).toBeVisible();
  });

  test("legal pages are reachable and noindexed", async ({ page, request }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("What I collect");

    const response = await request.get("/privacy");
    expect(await response.text()).toContain('name="robots" content="noindex, follow"');

    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Terms of use.");
  });

  test("navigation works between every route", async ({ page }) => {
    for (const [label, path] of [
      ["Services", "/services"],
      ["How it works", "/how-it-works"],
      ["Work", "/work"],
      ["About", "/about"],
    ] as const) {
      await page.goto("/");

      // The primary nav collapses behind a menu button below the md breakpoint,
      // so the route this test takes depends on the viewport it runs at.
      const primary = page.getByRole("navigation", { name: "Primary" });
      const nav = (await primary.isVisible())
        ? primary
        : await (async () => {
            await page.getByRole("button", { name: "Open menu" }).click();
            return page.getByRole("navigation", { name: "Mobile" });
          })();

      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("technology names stay out of the hero and appear only in the footer", async ({ page }) => {
    await page.goto("/");

    const heroText = await page.locator("main section").first().innerText();
    for (const tech of ["React", "Next.js", "TypeScript", "Python", "Supabase", "Postgres", "n8n", "Docker"]) {
      expect(heroText, `${tech} appears in the hero`).not.toContain(tech);
    }

    const footerText = await page.locator("footer").innerText();
    expect(footerText).toContain("React");
    expect(footerText).toContain("Postgres");
  });

  test("SEO essentials are in the static HTML", async ({ request }) => {
    const home = await (await request.get("/")).text();
    expect(home).toContain('<link rel="canonical" href="https://ibrahemahmed.com/"');
    expect(home).toContain('rel="alternate" hreflang="ar"');
    expect(home).toContain('"@type": "FAQPage"');
    expect(home).toContain('property="og:image"');
    // Positioning must not survive in the structured data either.
    expect(home).not.toContain("KanyouAI");
    expect(home).not.toContain("Favikon");

    const services = await (await request.get("/services")).text();
    expect(services).toContain('<link rel="canonical" href="https://ibrahemahmed.com/services"');
    // /services now has a real Arabic counterpart, so it declares the pair.
    // The "no false signal" case is asserted against /terms below.
    expect(services).toContain('hreflang="ar" href="https://ibrahemahmed.com/ar/services/"');

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /audit/");
    expect(robots).toContain("Sitemap: https://ibrahemahmed.com/sitemap.xml");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of [
      "/",
      "/services",
      "/how-it-works",
      "/work",
      "/about",
      "/ar/",
      "/ar/services/",
      "/ar/how-it-works/",
      "/ar/work/",
      "/ar/about/",
    ]) {
      expect(sitemap).toContain(`<loc>https://ibrahemahmed.com${path}</loc>`);
    }
    expect(sitemap).not.toContain("/privacy");
  });

  test("the Arabic route survives and points at the same offer", async ({ page }) => {
    await page.goto("/ar/");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("شركتك");
    await expect(page.getByRole("link", { name: /ابدأ تفكيك الأنظمة/ }).first()).toHaveAttribute(
      "href",
      "https://audit.ibrahemahmed.com",
    );
  });

  test("every Arabic route renders its own content", async ({ page }) => {
    for (const [path, heading] of [
      ["/ar/", "شركتك لا يجب أن تعتمد"],
      ["/ar/services/", "أربع طرق للعمل معي"],
      ["/ar/how-it-works/", "الرسم. التسعير. البناء. التسليم."],
      ["/ar/work/", "افتحها واحكم بنفسك."],
      ["/ar/about/", "أبني الأنظمة الداخلية"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

      // The Arabic pages must not fall back to English copy.
      const text = await page.locator("main").innerText();
      expect(text, `${path} contains untranslated English`).not.toContain("Your business shouldn't depend");
      expect(text, `${path} contains untranslated English`).not.toContain("Fixed scope, fixed price");
    }
  });

  test("Arabic navigation moves between Arabic routes", async ({ page }) => {
    await page.goto("/ar/");

    const primary = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    const nav = (await primary.isVisible())
      ? primary
      : await (async () => {
          await page.getByRole("button", { name: "فتح القائمة" }).click();
          return page.getByRole("navigation", { name: "قائمة الجوال" });
        })();

    await nav.getByRole("link", { name: "الخدمات", exact: true }).click();
    await expect(page).toHaveURL(/\/ar\/services\/$/);
    await expect(page.locator("#systems-teardown")).toBeVisible();
  });

  test("each language links to its counterpart and nothing else", async ({ request }) => {
    // A page with a real translation declares the pair on both sides.
    const arServices = await (await request.get("/ar/services/")).text();
    expect(arServices).toContain('hreflang="en" href="https://ibrahemahmed.com/services"');
    expect(arServices).toContain('hreflang="ar" href="https://ibrahemahmed.com/ar/services/"');
    expect(arServices).toContain('<link rel="canonical" href="https://ibrahemahmed.com/ar/services/"');

    const enServices = await (await request.get("/services")).text();
    expect(enServices).toContain('hreflang="ar" href="https://ibrahemahmed.com/ar/services/"');

    // A page with no translation claims none.
    const terms = await (await request.get("/terms")).text();
    expect(terms).not.toContain("hreflang");
  });

  test("Arabic pages carry Arabic structured data and the Arabic social card", async ({ request }) => {
    const home = await (await request.get("/ar/")).text();

    expect(home).toContain('"inLanguage": "ar"');
    expect(home).toContain("تفكيك الأنظمة");
    expect(home).toContain('"@type": "FAQPage"');
    expect(home).toContain("og-image-ar.png");
    expect(home).toContain('content="ar_AR"');

    // English structured data must not leak into the Arabic graph.
    expect(home).not.toContain("Software developer building internal business systems");
  });

  test("answer engines are given a summary in both languages", async ({ request }) => {
    const en = await (await request.get("/llms.txt")).text();
    expect(en).toContain("https://ibrahemahmed.com/ar/");
    expect(en).toContain("Do not infer or generate them.");

    const ar = await (await request.get("/ar/llms.txt")).text();
    expect(ar).toContain("أنظمة تشغيل داخلية للشركات الصغيرة");
    expect(ar).toContain("https://ibrahemahmed.com/ar/services/");
    expect(ar).toContain("لا تستنتج هذه الأرقام ولا تولّدها");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("/ar/llms.txt");
  });

  test("the about page shows the portrait", async ({ page }) => {
    await page.goto("/about");

    const portrait = page.locator("figure img").first();
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute("alt", /Ibrahem Ahmed Hassan Adam/);

    // It must actually load, not 404 into a broken image.
    const loaded = await portrait.evaluate((node: HTMLImageElement) => node.naturalWidth > 0);
    expect(loaded).toBe(true);
  });

  test("content is readable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Your business shouldn't depend on");
    await expect(page.getByRole("link", { name: "Start a Systems Teardown" }).first()).toBeVisible();
    await context.close();
  });

  test("layout does not scroll horizontally at phone width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });

    for (const path of ["/", "/services", "/how-it-works", "/work", "/about"]) {
      await page.goto(path);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflows, `${path} scrolls sideways at 360px`).toBe(false);
    }
  });

  test("the mobile menu opens, navigates and is keyboard dismissible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
  });
});
