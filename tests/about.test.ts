import { describe, expect, it } from "vitest";
import { STACK } from "../src/config/site";
import { CLIENT_SYSTEMS, experienceFlow } from "../src/config/content";
import { experienceFlowAr, STACK_GROUPS_AR, STACK_NOTES_AR } from "../src/config/content.ar";

/**
 * The /about "Experience" and "Tools" sections are built from real facts
 * (site.ts, CLIENT_SYSTEMS) rather than hand-typed numbers, specifically so a
 * repo count or a new client system doesn't have to be edited in three places.
 * These tests are what catches the English and Arabic copies drifting apart
 * when one of those source facts changes and the other list isn't touched.
 */

describe("the experience strip", () => {
  it("states the real, current repository and client-system counts", () => {
    const nodes = experienceFlow(22);
    expect(nodes).toHaveLength(4);
    expect(nodes[2].label).toBe("22 public repositories");
    expect(nodes[3].label).toBe(`${CLIENT_SYSTEMS.length} systems shipped for clients`);
  });

  it("states no year or date — none is confirmed", () => {
    // A guessed year is worse than no timeline; this is the guard against one
    // creeping back in during a future edit.
    for (const node of experienceFlow(22)) {
      expect(node.label + node.meta).not.toMatch(/\b(19|20)\d{2}\b/);
    }
  });

  it("has the same number of nodes in Arabic as in English", () => {
    const en = experienceFlow(22);
    const ar = experienceFlowAr(22, CLIENT_SYSTEMS.length);
    expect(ar).toHaveLength(en.length);
  });
});

describe("the tools grid", () => {
  it("gives every stack group a rationale, not just a name", () => {
    for (const group of STACK) {
      expect(group.note.length, `${group.group} has no note`).toBeGreaterThan(20);
    }
  });

  it("translates every stack group and its note for the Arabic page", () => {
    for (const group of STACK) {
      expect(STACK_GROUPS_AR[group.group], `${group.group} has no Arabic label`).toBeTruthy();
      expect(STACK_NOTES_AR[group.group], `${group.group} has no Arabic note`).toBeTruthy();
    }
  });
});
