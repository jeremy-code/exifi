import { Time } from "@internationalized/date";
import type { RationalObject } from "libexif-wasm";
import { describe, test, expect } from "vitest";

import { parseExifTimeStamp } from "./parseExifTimeStamp";

describe("parseExifTimeStamp", () => {
  test.for([
    [
      [
        { numerator: 5, denominator: 1 },
        { numerator: 24, denominator: 1 },
        { numerator: 43, denominator: 1 },
      ] as RationalObject[],
      new Time(5, 24, 43),
    ],
  ] as const)("parses %s timestamp correctly", ([input, expected]) => {
    expect(parseExifTimeStamp(input).compare(expected)).toBe(0);
  });
});
