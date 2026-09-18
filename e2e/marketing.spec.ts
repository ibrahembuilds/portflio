import { expect, test } from "@playwright/test";

/**
 * The marketing site is a single prerendered scrolling page, so these
 * assertions run against exactly what a crawler and a first-time visitor
 * receive. /privacy and /terms remain separate routes; everything else lives
 * on "/" (and "/ar/") behind an anchor.
 */

test.describe("marketing site", () => {
  test("homepage leads with the positioning and the primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /The technical partner you don't have on staff\./,
    );
    await expect(page.getByText(/I plan, build and run the internal systems/)).toBeVisible();

    // Primary CTA points at the assessment, not at a contact form.
    const cta = page.getByRole("link", { name: "Start a Systems Teardown" }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "https://audit.ibrahemahmed.com");

    await expect(page.getByRole("link", { name: "See what I build" })).toHaveAttribute("href", "/#projects");
  });

  test("homepage carries every section, in order", async ({ page }) => {
    await page.goto("/");

    const headings = await page.locator("main h2, main h1").allInnerTexts();
    const joined = headings.join(" | ");

    const order = [
      "The technical partner you don't have on staff.",
      "Most owners don't describe this as a software problem.",
      "I build the internal systems small businesses end up running on.",
      "Owners and operations managers, not procurement committees.",
      "Open it and judge it yourself.",
      "Four ways to bring in the technical side you don't have.",
      "Four steps. No open-ended engagements.",
      "Find out what is worth fixing before you spend anything.",
      "Questions owners ask.",
      "Start with one process that is costing you time.",
    ];

    let cursor = -1;
    for (const heading of order) {
      const index = joined.indexOf(heading);
      expect(index, `"${heading}" missing or out of order`).toBeGreaterThan(cursor);
      cursor = index;
    }
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

    for (const path of ["/", "/ar/"]) {
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
    await page.goto("/");

    // Owner quotes are excluded: "We pay for software that does 20% of what
    // we need" is a customer's own words, not a claim the site is making.
    const text = await page.locator("main").evaluate((main) => {
      const clone = main.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("blockquote").forEach((node) => node.remove());
      return clone.innerText ?? clone.textContent ?? "";
    });

    expect(text, "currency figure on /").not.toMatch(/[$£€]\s?\d/);
    expect(text, "percentage claim on /").not.toMatch(/\b\d+\s?%/);
    expect(text, "hours-saved claim on /").not.toMatch(/\b\d+\+?\s*(hours|hrs)\s+(saved|per|a)\b/i);
    expect(text, "30-day guarantee on /").not.toMatch(/30[- ]day guarantee/i);
    expect(text.toLowerCase(), "testimonial marker on /").not.toContain("clients served");
  });

  test("the services section lists exactly the four offers with no pricing", async ({ page }) => {
    await page.goto("/");

    for (const id of ["systems-teardown", "core-system-build", "automation-sprint", "care-plan"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    const text = await page.locator("#services").innerText();
    expect(text).toContain("I don't publish prices for work I haven't scoped.");
    expect(text).not.toMatch(/[$£€]\s?\d/);

    // The Teardown is the only offer with its own CTA.
    await expect(page.locator("#systems-teardown").getByRole("link", { name: /Start a Systems Teardown/ })).toBeVisible();
  });

  test("how I work shows the four-step framework verbatim", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("#how-i-work").innerText();

    expect(text).toContain("I spend 20 minutes on what you actually do, not what you want built.");
    expect(text).toContain("Fixed scope, fixed price, fixed date. If I can't fix it, I tell you and we stop.");
    expect(text).toContain("You see it working in week one, not at the end.");
    expect(text).toContain("Your data, your accounts, your documentation. No lock-in.");
  });

  test("the projects section shows only openable proof", async ({ page }) => {
    await page.goto("/");
    const projects = page.locator("#projects");

    await expect(projects.getByRole("link", { name: /ncase\.com\.sa/ })).toBeVisible();
    await expect(projects.getByRole("link", { name: "Read the code" })).toHaveAttribute(
      "href",
      "https://github.com/ibrahembuilds",
    );
    await expect(projects.getByText("22 public repositories on GitHub")).toBeVisible();
  });

  test("the experience section carries only verified facts", async ({ page }) => {
    await page.goto("/");
    const experience = page.locator("#experience");

    await expect(experience.getByText("Founder, KanyouAI")).toBeVisible();
    await expect(experience.getByText("Applied AI, Multimedia University, Malaysia")).toBeVisible();
    await expect(experience.getByText("22 repositories on GitHub")).toBeVisible();
  });

  test("legal pages are reachable and noindexed", async ({ page, request }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("What I collect");

    const response = await request.get("/privacy");
    expect(await response.text()).toContain('name="robots" content="noindex, follow"');

    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Terms of use.");
  });

  test("primary navigation scrolls to each section on the one-pager", async ({ page }) => {
    await page.goto("/");

    for (const [label, id] of [
      ["Experience", "experience"],
      ["Projects", "projects"],
      ["Services", "services"],
      ["FAQ", "faq"],
    ] as const) {
      const primary = page.getByRole("navigation", { name: "Primary" });
      const nav = (await primary.isVisible())
        ? primary
        : await (async () => {
            await page.getByRole("button", { name: "Open menu" }).click();
            return page.getByRole("navigation", { name: "Mobile" });
          })();

      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test("technology names stay out of the hero and appear only as proof in Experience", async ({ page }) => {
    await page.goto("/");

    const heroText = await page.locator("main section").first().innerText();
    for (const tech of ["React", "Next.js", "TypeScript", "Python", "Supabase", "Postgres", "n8n", "Docker"]) {
      expect(heroText, `${tech} appears in the hero`).not.toContain(tech);
    }

    const experienceText = await page.locator("#experience").innerText();
    expect(experienceText).toContain("React");
    expect(experienceText).toContain("Postgres");
  });

  test("SEO essentials are in the static HTML", async ({ request }) => {
    const home = await (await request.get("/")).text();
    expect(home).toContain('<link rel="canonical" href="https://ibrahemahmed.com/"');
    expect(home).toContain('rel="alternate" hreflang="ar"');
    expect(home).toContain('"@type": "FAQPage"');
    expect(home).toContain('property="og:image"');
    // Unrelated positioning must not survive in the structured data.
    // (KanyouAI is Ibrahem's own company — it belongs here.)
    expect(home).not.toContain("Favikon");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /audit/");
    expect(robots).toContain("Sitemap: https://ibrahemahmed.com/sitemap.xml");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/", "/ar/"]) {
      expect(sitemap).toContain(`<loc>https://ibrahemahmed.com${path}</loc>`);
    }
    expect(sitemap).not.toContain("/privacy");
    expect(sitemap).not.toContain("/services");
    expect(sitemap).not.toContain("/ar/services/");
  });

  test("the Arabic route survives and points at the same offer", async ({ page }) => {
    await page.goto("/ar/");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("الشريك التقني");
    await expect(page.getByRole("link", { name: /ابدأ تفكيك الأنظمة/ }).first()).toHaveAttribute(
      "href",
      "https://audit.ibrahemahmed.com",
    );
  });

  test("the Arabic page carries every section and no untranslated English", async ({ page }) => {
    await page.goto("/ar/");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    for (const id of ["experience", "projects", "services", "faq"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    const text = await page.locator("main").innerText();
    expect(text, "/ar/ contains untranslated English").not.toContain("The technical partner");
    expect(text, "/ar/ contains untranslated English").not.toContain("Fixed scope, fixed price");
  });

  test("Arabic navigation scrolls to each section on the one-pager", async ({ page }) => {
    await page.goto("/ar/");

    const primary = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    const nav = (await primary.isVisible())
      ? primary
      : await (async () => {
          await page.getByRole("button", { name: "فتح القائمة" }).click();
          return page.getByRole("navigation", { name: "قائمة الجوال" });
        })();

    await nav.getByRole("link", { name: "الخدمات", exact: true }).click();
    await expect(page).toHaveURL(/\/ar\/#services$/);
    await expect(page.locator("#systems-teardown")).toBeInViewport();
  });

  test("each language links to its counterpart and nothing else", async ({ request }) => {
    const home = await (await request.get("/")).text();
    expect(home).toContain('hreflang="ar" href="https://ibrahemahmed.com/ar/"');

    const ar = await (await request.get("/ar/")).text();
    expect(ar).toContain('hreflang="en" href="https://ibrahemahmed.com/"');
    expect(ar).toContain('<link rel="canonical" href="https://ibrahemahmed.com/ar/"');

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
    expect(home).not.toContain("Technical partner for small businesses without a CTO");
  });

  // The social card is a generated image: nothing about it type-checks, and a
  // clipped headline looks fine in the build log. This measures the artifact.
  for (const { card, side, label } of [
    { card: "/og-image.png", side: "left" as const, label: "English" },
    { card: "/og-image-ar.png", side: "right" as const, label: "Arabic" },
  ]) {
    test(`the ${label} social card keeps its type inside the gutter`, async ({ page }) => {
      // Same origin, so the canvas stays readable.
      await page.goto("/");

      const ink = await page.evaluate(async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // The type is near-black on a very light accent; the portrait is the
        // only other dark thing, and it lives on the opposite half.
        const isInk = (i: number) => data[i] < 90 && data[i + 1] < 90 && data[i + 2] < 90;

        let leftmost = canvas.width;
        let rightmost = -1;
        for (let y = 150; y <= 480; y += 1) {
          for (let x = 0; x < canvas.width; x += 1) {
            if (!isInk((y * canvas.width + x) * 4)) continue;
            if (x < leftmost) leftmost = x;
            if (x > rightmost) rightmost = x;
          }
        }
        return { width: canvas.width, height: canvas.height, leftmost, rightmost };
      }, card);

      expect(ink.width).toBe(1200);
      expect(ink.height).toBe(630);

      // 66px of padding, so ink must stop short of the edge on the text side.
      // The portrait is allowed to bleed off the other side.
      const margin = side === "left" ? ink.leftmost : ink.width - 1 - ink.rightmost;
      expect(margin, `${label} card: type is clipped at the ${side} edge`).toBeGreaterThanOrEqual(40);
    });
  }

  test("Arabic pages preload the Arabic face, English pages do not", async ({ request }) => {
    // Arabic is set in a different file from the one index.html preloads for
    // every route, so without this the Arabic pages paint in a fallback and
    // reflow. The English side must not pay for a face it never renders.
    const ar = await (await request.get("/ar/")).text();
    expect(ar).toContain('rel="preload" href="/fonts/plex-arabic-400-normal.woff2"');
    expect(ar).toContain('rel="preload" href="/fonts/plex-arabic-600-normal.woff2"');
    expect(ar).toContain('rel="preload" href="/fonts/geist-sans-latin-400-normal.woff2"');

    const en = await (await request.get("/")).text();
    expect(en).not.toContain("plex-arabic");

    // The face itself has to be served, not just referenced.
    const face = await request.get("/fonts/plex-arabic-400-normal.woff2");
    expect(face.status()).toBe(200);
  });

  test("answer engines are given a summary in both languages", async ({ request }) => {
    const en = await (await request.get("/llms.txt")).text();
    expect(en).toContain("https://ibrahemahmed.com/ar/");
    expect(en).toContain("Do not infer or generate them.");

    const ar = await (await request.get("/ar/llms.txt")).text();
    expect(ar).toContain("الشريك التقني");
    expect(ar).toContain("https://ibrahemahmed.com/ar/#services");
    expect(ar).toContain("لا تستنتج هذه الأرقام ولا تولّدها");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("/ar/llms.txt");
  });

  test("the hero shows the portrait", async ({ page }) => {
    await page.goto("/");

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

    await expect(page.getByRole("heading", { level: 1 })).toContainText("The technical partner you don't have");
    await expect(page.getByRole("link", { name: "Start a Systems Teardown" }).first()).toBeVisible();
    await context.close();
  });

  test("layout does not scroll horizontally at phone width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });

    for (const path of ["/", "/ar/"]) {
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
    await expect(page).toHaveURL(/\/#services$/);
  });

  test("old URLs redirect to the matching section", async ({ page }) => {
    // vercel.json owns the actual redirect at the edge; this only asserts the
    // config exists and resolves to the right anchor, since the local e2e
    // server does not replay Vercel routing.
    const vercelConfig = await import("../vercel.json", { with: { type: "json" } });
    const redirects = vercelConfig.default.redirects as { source: string; destination: string }[];

    const expected: [string, string][] = [
      ["/services", "/#services"],
      ["/services/", "/#services"],
      ["/how-it-works", "/#how-i-work"],
      ["/how-it-works/", "/#how-i-work"],
      ["/work", "/#projects"],
      ["/work/", "/#projects"],
      ["/about", "/#experience"],
      ["/about/", "/#experience"],
      ["/ar/services", "/ar/#services"],
      ["/ar/services/", "/ar/#services"],
      ["/ar/how-it-works", "/ar/#how-i-work"],
      ["/ar/how-it-works/", "/ar/#how-i-work"],
      ["/ar/work", "/ar/#projects"],
      ["/ar/work/", "/ar/#projects"],
      ["/ar/about", "/ar/#experience"],
      ["/ar/about/", "/ar/#experience"],
    ];

    for (const [source, destination] of expected) {
      const redirect = redirects.find((entry) => entry.source === source);
      expect(redirect, `no redirect configured for ${source}`).toBeTruthy();
      expect(redirect?.destination).toBe(destination);
    }

    // Sanity-check the destinations actually exist on the live page.
    await page.goto("/");
    for (const id of ["services", "how-i-work", "projects", "experience"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});
