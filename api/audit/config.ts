import { env } from "../../src/server/env";
import { requireMethod, sendJson, type ApiRequest, type ApiResponse } from "../../src/server/http";

/**
 * GET /api/audit/config
 *
 * Public, non-secret runtime configuration for the assessment client: whether a
 * booking link exists and whether bot protection is switched on. Secrets are
 * never included — only the Turnstile *site* key, which is public by design.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "GET")) return;

  sendJson(res, 200, {
    booking_configured: env.bookingUrl.length > 0,
    turnstile_site_key: (process.env.TURNSTILE_SITE_KEY ?? "").trim(),
    contact_email: "hello@ibrahemahmed.com",
    site_url: env.publicSiteUrl,
  });
}
