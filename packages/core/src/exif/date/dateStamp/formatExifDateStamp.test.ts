import { CalendarDate } from "@internationalized/date";
import { describe, test, expect } from "vitest";

import { formatExifDateStamp } from "./formatExifDateStamp";

describe("parseExifDateStamp", () => {
  test.for([
    [new CalendarDate(2026, 5, 11), "2026:05:11"],
    [new CalendarDate(1582, 10, 15), "1582:10:15"],
    [new CalendarDate(1544, 1, 1), "1544:01:01"],
  ] as const)("parses %s datestamp correctly", ([input, expected]) => {
    expect(formatExifDateStamp(input)).toBe(expected);
  });
});
