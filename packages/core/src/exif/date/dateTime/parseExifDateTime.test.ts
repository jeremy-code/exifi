import { CalendarDateTime } from "@internationalized/date";
import { describe, test, expect } from "vitest";

import { parseExifDateTime } from "./parseExifDateTime";

describe("parseExifDateTime", () => {
  test.for([
    ["2026:05:10 22:24:45", new CalendarDateTime(2026, 5, 10, 22, 24, 45)],
    ["2025:05:16 08:31:43", new CalendarDateTime(2025, 5, 16, 8, 31, 43)],
    ["2023:02:23 17:16:59", new CalendarDateTime(2023, 2, 23, 17, 16, 59)],
    ["2017:05:29 11:11:16", new CalendarDateTime(2017, 5, 29, 11, 11, 16)],
  ] as const)("parses %s datetime correctly", ([input, expected]) => {
    expect(parseExifDateTime(input).compare(expected)).toBe(0);
  });
});
