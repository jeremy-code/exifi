import { Time } from "@internationalized/date";
import type { RationalObject } from "libexif-wasm";
import { describe, test, expect } from "vitest";

import { formatTimeStamp, parseTimeStamp } from "./timeStamp";

describe("formatTimeStamp", () => {
  test.for([[new Time(5, 24, 43), [5, 1, 24, 1, 43, 1]]] as const)(
    "formats %s timestamp correctly",
    ([input, expected]) => {
      expect(formatTimeStamp(input)).toEqual(expected);
    },
  );
});

describe("parseTimeStamp", () => {
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
    expect(parseTimeStamp(input).compare(expected)).toBe(0);
  });
});
