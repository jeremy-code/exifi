import { describe, expect, it } from "vitest";

import { formatPlural, type PluralRules } from "./formatPlural";

const BYTE_PLURAL_MAP = {
  other: " bytes",
  one: " byte",
} satisfies PluralRules;

describe("formatPlural()", () => {
  describe("formats English plurals", () => {
    it.each([
      [[0, BYTE_PLURAL_MAP], "0 bytes"],
      [[1, BYTE_PLURAL_MAP], "1 byte"],
      [[2, BYTE_PLURAL_MAP], "2 bytes"],
    ] as const)("formats %i correctly", (input, expected) => {
      expect(formatPlural(input[0], input[1])).toBe(expected);
    });
  });

  describe("defaults to other if plural rule isn't avaliable", () => {
    it.each([
      [[0, { other: " bytes" }], "0 bytes"],
      [[1, { other: " bytes" }], "1 bytes"],
    ] as const)("formats %i correctly", (input, expected) => {
      expect(formatPlural(input[0], input[1])).toBe(expected);
    });
  });

  describe("returns number for empty rule", () => {
    it.each([
      [[0, {}], "0"],
      [[1, {}], "1"],
    ] as const)("formats %i correctly", (input, expected) => {
      // @ts-expect-error For testing purposes
      expect(formatPlural(input[0], input[1])).toBe(expected);
    });
  });
});
