import { CalendarDate } from "@internationalized/date";
import { describe, test, expect } from "vitest";

import { formatDateStamp, parseDateStamp } from "./dateStamp";

describe("formatDateStamp", () => {
  test.for([
    [new CalendarDate(2026, 5, 11), "2026:05:11"],
    [new CalendarDate(1582, 10, 15), "1582:10:15"],
    [new CalendarDate(1544, 1, 1), "1544:01:01"],
  ] as const)("formats %s datestamp correctly", ([input, expected]) => {
    expect(formatDateStamp(input)).toBe(expected);
  });
});

describe("parseDateStamp", () => {
  test.for([
    ["2026:05:11", new CalendarDate(2026, 5, 11)],
    ["1582:10:15", new CalendarDate(1582, 10, 15)],
    ["1544:01:01", new CalendarDate(1544, 1, 1)],
  ] as const)("parses %s datestamp correctly", ([input, expected]) => {
    expect(parseDateStamp(input).compare(expected)).toBe(0);
  });
});
