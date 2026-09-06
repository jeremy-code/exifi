import { describe, expect, test } from "vitest";

import { formatPlural, type PluralRules } from "./formatPlural";

const BYTE_PLURAL_MAP = {
  other: " bytes",
  one: " byte",
} satisfies PluralRules;

describe("formatPlural()", () => {
  describe("formats English plurals", () => {
    test.for([
      [0, BYTE_PLURAL_MAP, "0 bytes"],
      [1, BYTE_PLURAL_MAP, "1 byte"],
      [2, BYTE_PLURAL_MAP, "2 bytes"],
    ] as const)("formats %i correctly", ([num, pluralRules, expected]) => {
      expect(formatPlural(num, pluralRules)).toBe(expected);
    });
  });

  describe("defaults to other if plural rule isn't avaliable", () => {
    test.for([
      [0, { other: " bytes" }, "0 bytes"],
      [1, { other: " bytes" }, "1 bytes"],
    ] as const)("formats %i correctly", ([num, pluralRules, expected]) => {
      expect(formatPlural(num, pluralRules)).toBe(expected);
    });
  });

  describe("returns number for empty rule", () => {
    test.for([
      [0, {}, "0"],
      [1, {}, "1"],
    ] as const)("formats %i correctly", ([num, pluralRules, expected]) => {
      // @ts-expect-error For testing purposes
      expect(formatPlural(num, pluralRules)).toBe(expected);
    });
  });
});
