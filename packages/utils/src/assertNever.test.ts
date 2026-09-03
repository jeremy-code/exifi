import { describe, expect, test } from "vitest";

import { assertNever } from "./assertNever";

describe("assertNever function", () => {
  describe("should throw an error", () => {
    test.each([
      ["object", {}],
      ["null", null],
      ["undefined", undefined],
      ["number", 0],
      ["string", "string"],
      ["boolean", true],
      ["symbol", Symbol.iterator],
    ])("should throw for %s", (_, value) => {
      expect(() => assertNever(value as never)).toThrow();
    });
  });
});
