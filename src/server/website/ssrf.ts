import { isIP } from "node:net";

/**
 * Address-space checks for outbound fetches of prospect-supplied URLs.
 *
 * These run against the IP the socket is actually about to connect to (see
 * safeFetch's custom lookup hook), not against a hostname resolved earlier.
 * Validating a hostname and then handing the hostname to a fetch leaves a DNS
 * rebinding window between the two; validating at connect time does not.
 */

export type UrlRejection =
  | "invalid-url"
  | "blocked-scheme"
  | "blocked-port"
  | "blocked-host"
  | "blocked-address"
  | "too-many-redirects";

export class BlockedUrlError extends Error {
  constructor(readonly reason: UrlRejection, message?: string) {
    super(message ?? `Blocked URL: ${reason}`);
    this.name = "BlockedUrlError";
  }
}

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const ALLOWED_PORTS = new Set(["", "80", "443"]);

/** Hostnames that must never be resolved, independent of what DNS returns. */
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata",
  "metadata.google.internal",
  "instance-data",
]);

const BLOCKED_HOST_SUFFIXES = [".localhost", ".local", ".internal", ".localdomain", ".home.arpa", ".onion"];

const ipv4ToInt = (address: string): number | null => {
  const parts = address.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = value * 256 + octet;
  }
  return value >>> 0;
};

const inRange = (value: number, cidr: string): boolean => {
  const [base, bitsRaw] = cidr.split("/");
  const bits = Number(bitsRaw);
  const baseValue = ipv4ToInt(base);
  if (baseValue === null) return false;
  if (bits === 0) return true;
  const mask = (0xffffffff << (32 - bits)) >>> 0;
  return (value & mask) === (baseValue & mask);
};

/** Every IPv4 block that is not routable on the public internet. */
const BLOCKED_V4 = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.0.0.0/24",
  "192.0.2.0/24",
  "192.88.99.0/24",
  "192.168.0.0/16",
  "198.18.0.0/15",
  "198.51.100.0/24",
  "203.0.113.0/24",
  "224.0.0.0/4",
  "240.0.0.0/4",
];

export const isBlockedIpv4 = (address: string): boolean => {
  const value = ipv4ToInt(address);
  if (value === null) return true;
  return BLOCKED_V4.some((cidr) => inRange(value, cidr));
};

const expandIpv6 = (address: string): number[] | null => {
  const zoneless = address.split("%")[0].toLowerCase();
  const [head, tail] = zoneless.split("::");
  const parse = (segment: string) => (segment ? segment.split(":").filter(Boolean) : []);
  const headParts = parse(head ?? "");
  const tailParts = parse(tail ?? "");

  let groups: string[];
  if (zoneless.includes("::")) {
    const fill = 8 - headParts.length - tailParts.length;
    if (fill < 0) return null;
    groups = [...headParts, ...Array(fill).fill("0"), ...tailParts];
  } else {
    groups = headParts;
  }

  // A trailing dotted-quad (::ffff:127.0.0.1) expands into two groups.
  const last = groups[groups.length - 1];
  if (last && last.includes(".")) {
    const value = ipv4ToInt(last);
    if (value === null) return null;
    groups = [...groups.slice(0, -1), ((value >>> 16) & 0xffff).toString(16), (value & 0xffff).toString(16)];
  }

  if (groups.length !== 8) return null;
  const numbers = groups.map((group) => Number.parseInt(group || "0", 16));
  return numbers.some((n) => Number.isNaN(n) || n < 0 || n > 0xffff) ? null : numbers;
};

export const isBlockedIpv6 = (address: string): boolean => {
  const groups = expandIpv6(address);
  if (!groups) return true;

  const isZero = groups.every((group) => group === 0);
  if (isZero) return true; // ::
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1) return true; // ::1

  const first = groups[0];
  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link local
  if ((first & 0xff00) === 0xff00) return true; // ff00::/8 multicast

  // IPv4-mapped (::ffff:a.b.c.d), IPv4-compatible and NAT64 (64:ff9b::/96):
  // fall through to the IPv4 rules on the embedded address.
  const embedded = () => {
    const value = ((groups[6] << 16) | groups[7]) >>> 0;
    return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff].join(".");
  };
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) return isBlockedIpv4(embedded());
  if (groups[0] === 0x0064 && groups[1] === 0xff9b) return isBlockedIpv4(embedded());
  if (groups.slice(0, 6).every((group) => group === 0)) return true;

  // 6to4 (2002::/16) embeds an IPv4 address in the next 32 bits.
  if (groups[0] === 0x2002) {
    const value = ((groups[1] << 16) | groups[2]) >>> 0;
    const v4 = [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff].join(".");
    return isBlockedIpv4(v4);
  }

  return false;
};

/** True when connecting to this literal address must be refused. */
export const isBlockedAddress = (address: string): boolean => {
  const family = isIP(address);
  if (family === 4) return isBlockedIpv4(address);
  if (family === 6) return isBlockedIpv6(address);
  return true;
};

export const isBlockedHostname = (hostname: string): boolean => {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (BLOCKED_HOSTNAMES.has(host)) return true;
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) return true;
  // A bare literal IP in the URL is checked directly; a name is checked again
  // at connect time once DNS has resolved it.
  if (isIP(host) !== 0) return isBlockedAddress(host);
  // Reject anything without a dot: single-label names resolve to internal hosts.
  if (!host.includes(".")) return true;
  return false;
};

/**
 * Parses and validates a prospect-supplied URL. Throws BlockedUrlError with a
 * specific reason so the caller can log why a fetch was refused without
 * echoing the URL back to the prospect.
 */
export const assertSafeUrl = (raw: string): URL => {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new BlockedUrlError("invalid-url");
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) throw new BlockedUrlError("blocked-scheme");
  if (!ALLOWED_PORTS.has(url.port)) throw new BlockedUrlError("blocked-port");
  if (url.username || url.password) throw new BlockedUrlError("blocked-host");
  if (isBlockedHostname(url.hostname)) throw new BlockedUrlError("blocked-host");

  return url;
};

/**
 * Accepts what an owner would actually type ("acme.com", "www.acme.com/about")
 * and turns it into an https URL before validation.
 */
export const normaliseWebsiteInput = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
};
