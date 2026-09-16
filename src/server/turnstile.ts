import { env } from "./env";

/**
 * Cloudflare Turnstile verification. Optional: when no secret is configured the
 * check is skipped, so the funnel works before bot protection is switched on.
 * Rate limiting and server-side validation still apply either way.
 */

export type TurnstileResult = { ok: true; skipped: boolean } | { ok: false; reason: string };

type TurnstileResponse = { success?: boolean; "error-codes"?: string[] };

export const verifyTurnstile = async (token: string, remoteIp?: string): Promise<TurnstileResult> => {
  if (!env.hasTurnstile) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "missing-token" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const form = new URLSearchParams({ secret: env.turnstileSecret, response: token });
    if (remoteIp && remoteIp !== "unknown") form.set("remoteip", remoteIp);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!response.ok) return { ok: false, reason: `http-${response.status}` };

    const payload = (await response.json()) as TurnstileResponse;
    if (payload.success) return { ok: true, skipped: false };
    return { ok: false, reason: (payload["error-codes"] ?? ["failed"]).join(",") };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return { ok: false, reason: "timeout" };
    return { ok: false, reason: error instanceof Error ? error.message.slice(0, 80) : "unknown" };
  } finally {
    clearTimeout(timeout);
  }
};
