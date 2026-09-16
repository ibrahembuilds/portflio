import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IncomingMessage } from "node:http";
import { clientIp, enforceRateLimit, HttpError, rateLimitKey } from "../src/server/http";
import { MemoryLeadStore } from "../src/server/store/memory";
import { __setLeadStore } from "../src/server/store";

/**
 * Rate limiting is tested here rather than end to end: the counter is keyed by
 * client address with an hour-long window, so a browser suite would drain a
 * shared bucket across its own cases and prove nothing about the limiter.
 */

const requestFrom = (ip: string): IncomingMessage =>
  ({ headers: { "x-forwarded-for": ip }, socket: { remoteAddress: ip } }) as unknown as IncomingMessage;

let store: MemoryLeadStore;

beforeEach(() => {
  store = new MemoryLeadStore();
  __setLeadStore(store);
});

afterEach(() => {
  __setLeadStore(null);
  vi.restoreAllMocks();
});

describe("clientIp", () => {
  it("takes the left-most entry of x-forwarded-for, which is the client", () => {
    const request = { headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" }, socket: {} } as unknown as IncomingMessage;
    expect(clientIp(request)).toBe("203.0.113.5");
  });

  it("falls back to the socket address", () => {
    const request = { headers: {}, socket: { remoteAddress: "198.51.100.7" } } as unknown as IncomingMessage;
    expect(clientIp(request)).toBe("198.51.100.7");
  });

  it("never returns an empty key", () => {
    expect(clientIp({ headers: {}, socket: {} } as unknown as IncomingMessage)).toBe("unknown");
  });
});

describe("rateLimitKey", () => {
  it("hashes the address rather than storing it", () => {
    const key = rateLimitKey("submit", "203.0.113.5");
    expect(key.startsWith("submit:")).toBe(true);
    expect(key).not.toContain("203.0.113.5");
  });

  it("is stable for the same address and different for another", () => {
    expect(rateLimitKey("submit", "203.0.113.5")).toBe(rateLimitKey("submit", "203.0.113.5"));
    expect(rateLimitKey("submit", "203.0.113.5")).not.toBe(rateLimitKey("submit", "203.0.113.6"));
  });

  it("separates scopes so one endpoint cannot exhaust another", () => {
    expect(rateLimitKey("submit", "203.0.113.5")).not.toBe(rateLimitKey("website", "203.0.113.5"));
  });
});

describe("enforceRateLimit", () => {
  it("allows requests up to the limit and refuses the next one", async () => {
    const request = requestFrom("203.0.113.5");

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await expect(enforceRateLimit("submit", request, 3)).resolves.toBeUndefined();
    }

    await expect(enforceRateLimit("submit", request, 3)).rejects.toThrow(HttpError);
  });

  it("refuses with 429 and a message a person can act on", async () => {
    const request = requestFrom("203.0.113.9");
    await enforceRateLimit("submit", request, 1);

    await expect(enforceRateLimit("submit", request, 1)).rejects.toMatchObject({
      status: 429,
      code: "rate_limited",
    });
  });

  it("counts each client separately", async () => {
    await enforceRateLimit("submit", requestFrom("203.0.113.1"), 1);
    // A second client is unaffected by the first one's usage.
    await expect(enforceRateLimit("submit", requestFrom("203.0.113.2"), 1)).resolves.toBeUndefined();
  });

  it("counts each endpoint separately", async () => {
    const request = requestFrom("203.0.113.3");
    await enforceRateLimit("submit", request, 1);
    await expect(enforceRateLimit("website", request, 1)).resolves.toBeUndefined();
  });

  it("starts a fresh window once the previous one has passed", async () => {
    const request = requestFrom("203.0.113.4");
    const start = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(start);

    await enforceRateLimit("submit", request, 1);
    await expect(enforceRateLimit("submit", request, 1)).rejects.toThrow();

    vi.spyOn(Date, "now").mockReturnValue(start + 3_600_001);
    await expect(enforceRateLimit("submit", request, 1)).resolves.toBeUndefined();
  });

  it("lets requests through when the counter itself is broken", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(store, "hitRateLimit").mockRejectedValue(new Error("database down"));

    // A limiter that cannot count must not take the endpoint down with it.
    await expect(enforceRateLimit("submit", requestFrom("203.0.113.8"), 1)).resolves.toBeUndefined();
  });
});

describe("the store's counter", () => {
  it("returns an increasing count within one window", async () => {
    expect(await store.hitRateLimit("k", 3_600)).toBe(1);
    expect(await store.hitRateLimit("k", 3_600)).toBe(2);
    expect(await store.hitRateLimit("k", 3_600)).toBe(3);
  });

  it("resets when the window rolls over", async () => {
    const start = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(start);
    expect(await store.hitRateLimit("k", 60)).toBe(1);
    expect(await store.hitRateLimit("k", 60)).toBe(2);

    vi.spyOn(Date, "now").mockReturnValue(start + 61_000);
    expect(await store.hitRateLimit("k", 60)).toBe(1);
  });
});
