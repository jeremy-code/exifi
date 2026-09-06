import { describe, expect, test } from "vitest";

import { formatBytes } from "./formatBytes";

describe("formatBytes()", () => {
  describe("formats base SI units in bytes", () => {
    test.for([
      [1, "1 byte"],
      [1000, "1 kB"],
      [1_000_000, "1 MB"],
      [1_000_000_000, "1 GB"],
      [1_000_000_000_000, "1 TB"],
      [1_000_000_000_000_000, "1 PB"],
    ] as const)("formats %i bytes correctly", ([input, expected]) => {
      expect(formatBytes(input)).toBe(expected);
    });
  });

  describe("formats zero values in bytes", () => {
    test.for([
      [0, "0 byte"],
      [-0, "-0 byte"],
    ] as const)(
      "handles zero and negative values (%i)",
      ([input, expected]) => {
        expect(formatBytes(input)).toBe(expected);
      },
    );
  });

  describe("formats non-finite values", () => {
    test.for([
      [NaN, "NaN byte"],
      [Infinity, "∞ byte"],
      [-Infinity, "-∞ byte"],
    ] as const)("handles non-finite values (%s)", ([input, expected]) => {
      expect(formatBytes(input)).toBe(expected);
    });
  });

  describe("formats bytes with locale and options formatting", () => {
    test.for([
      [1000, "de-DE", undefined, "1 kB"],
      [1_234_567, "de-DE", { maximumSignificantDigits: 3 }, "1,23 MB"],
    ] as const)(
      "applies locale and options formatting correctly (%i, %s, %o)",
      ([bytes, locale, options, expected]) => {
        expect(formatBytes(bytes, locale, options)).toBe(expected);
      },
    );
  });
});
