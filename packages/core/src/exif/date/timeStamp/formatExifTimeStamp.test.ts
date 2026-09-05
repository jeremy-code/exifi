import { Time } from "@internationalized/date";
import { describe, test, expect } from "vitest";

import { formatExifTimeStamp } from "./formatExifTimeStamp";

describe("formatExifTimeStamp", () => {
  test.for([[new Time(5, 24, 43), [5, 1, 24, 1, 43, 1]]] as const)(
    "parses %s timestamp correctly",
    ([input, expected]) => {
      expect(formatExifTimeStamp(input)).toEqual(expected);
    },
  );
});
