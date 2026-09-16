import { env } from "../env";

/**
 * Email provider interface. The concrete provider is chosen from environment
 * variables, so no credential and no vendor name is baked into application code.
 */

export type Attachment = { filename: string; content: Buffer; contentType?: string };

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Attachment[];
};

export type SendResult = { ok: true; id: string } | { ok: false; reason: string };

export interface EmailProvider {
  readonly name: string;
  readonly available: boolean;
  send(message: EmailMessage): Promise<SendResult>;
}

/** Used when no provider is configured. Reports its own unavailability rather
 *  than pretending a send succeeded. */
export class NoopEmailProvider implements EmailProvider {
  readonly name = "noop";
  readonly available = false;

  async send(message: EmailMessage): Promise<SendResult> {
    console.warn(`[email] not configured — would have sent "${message.subject}" to ${message.to}`);
    return { ok: false, reason: "not-configured" };
  }
}

export class ResendProvider implements EmailProvider {
  readonly name = "resend";

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  get available() {
    return this.apiKey.length > 0 && this.from.length > 0;
  }

  async send(message: EmailMessage): Promise<SendResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: controller.signal,
        headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: this.from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          ...(message.html ? { html: message.html } : {}),
          ...(message.replyTo ? { reply_to: message.replyTo } : {}),
          ...(message.attachments?.length
            ? {
                attachments: message.attachments.map((attachment) => ({
                  filename: attachment.filename,
                  content: attachment.content.toString("base64"),
                })),
              }
            : {}),
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        return { ok: false, reason: `http-${response.status}: ${body.slice(0, 200)}` };
      }

      const payload = (await response.json()) as { id?: string };
      return { ok: true, id: payload.id ?? "" };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return { ok: false, reason: "timeout" };
      return { ok: false, reason: error instanceof Error ? error.message.slice(0, 200) : "unknown" };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const getEmailProvider = (): EmailProvider =>
  env.hasEmail ? new ResendProvider(env.resendApiKey, env.fromEmail) : new NoopEmailProvider();
