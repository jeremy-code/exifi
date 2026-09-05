import { CalendarDate } from "@internationalized/date";
import { describe, test, expect } from "vitest";

import { parseExifDateStamp } from "./parseExifDateStamp";

describe("parseExifDateStamp", () => {
  test.for([
    ["2026:05:11", new CalendarDate(2026, 5, 11)],
    ["1582:10:15", new CalendarDate(1582, 10, 15)],
    ["1544:01:01", new CalendarDate(1544, 1, 1)],
  ] as const)("parses %s datestamp correctly", ([input, expected]) => {
    expect(parseExifDateStamp(input).compare(expected)).toBe(0);
  });
});
