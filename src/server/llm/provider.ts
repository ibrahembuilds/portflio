import { env } from "../env";

/**
 * Minimal provider interface. The report generator depends on this, never on a
 * specific vendor, so swapping or adding a provider is one file.
 */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type CompletionRequest = {
  messages: ChatMessage[];
  maxTokens?: number;
  timeoutMs?: number;
  /** Ask the provider to constrain output to a JSON object where supported. */
  json?: boolean;
};

export type CompletionResult =
  | { ok: true; text: string; model: string }
  | { ok: false; reason: string; status?: number };

export interface LlmProvider {
  readonly name: string;
  readonly available: boolean;
  readonly model: string;
  complete(request: CompletionRequest): Promise<CompletionResult>;
}

/** Used whenever no provider is configured. Never throws; the caller falls back
 *  to the deterministic report. */
export class UnavailableProvider implements LlmProvider {
  readonly name = "none";
  readonly available = false;
  readonly model = "";

  constructor(private readonly why: string) {}

  async complete(): Promise<CompletionResult> {
    return { ok: false, reason: this.why };
  }
}

type OpenRouterChoice = { message?: { content?: string } };
type OpenRouterResponse = { choices?: OpenRouterChoice[]; model?: string; error?: { message?: string } };

export class OpenRouterProvider implements LlmProvider {
  readonly name = "openrouter";

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly baseUrl: string,
  ) {}

  get available() {
    return this.apiKey.length > 0 && this.model.length > 0;
  }

  async complete(request: CompletionRequest): Promise<CompletionResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? env.llmTimeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          "content-type": "application/json",
          // OpenRouter uses these for attribution in its dashboard only.
          "http-referer": env.publicSiteUrl,
          "x-title": "Systems Teardown",
        },
        body: JSON.stringify({
          model: this.model,
          messages: request.messages,
          max_tokens: request.maxTokens ?? env.llmMaxOutputTokens,
          temperature: 0.2,
          ...(request.json ? { response_format: { type: "json_object" } } : {}),
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        return { ok: false, reason: `http-${response.status}: ${body.slice(0, 200)}`, status: response.status };
      }

      const payload = (await response.json()) as OpenRouterResponse;
      if (payload.error?.message) return { ok: false, reason: payload.error.message.slice(0, 200) };

      const text = payload.choices?.[0]?.message?.content ?? "";
      if (!text.trim()) return { ok: false, reason: "empty-completion" };

      return { ok: true, text, model: payload.model ?? this.model };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return { ok: false, reason: "timeout" };
      return { ok: false, reason: error instanceof Error ? error.message.slice(0, 200) : "unknown" };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const getLlmProvider = (): LlmProvider => {
  if (!env.llmApiKey) return new UnavailableProvider("no-api-key");
  if (!env.llmModel) return new UnavailableProvider("no-model-configured");
  return new OpenRouterProvider(env.llmApiKey, env.llmModel, env.llmBaseUrl);
};
