import { Time } from "@internationalized/date";
import { describe, test, expect } from "vitest";

import { parseExifTimeStamp } from "./parseExifTimeStamp";

describe("parseExifTimeStamp", () => {
  test.for([[[5, 1, 24, 1, 43, 1], new Time(5, 24, 43)]] as const)(
    "parses %s timestamp correctly",
    ([input, expected]) => {
      expect(parseExifTimeStamp(input).compare(expected)).toBe(0);
    },
  );
});
