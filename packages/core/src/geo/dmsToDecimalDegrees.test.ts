import { describe, expect, test } from "vitest";

import { dmsToDecimalDegrees } from "./dmsToDecimalDegrees";

describe("dmsToDecimalDegrees", () => {
  test.for([
    {
      dms: {
        degrees: 38,
        minutes: 53,
        seconds: 52,
        direction: "N",
      },
      expectedDecimalDegrees: 38.897778,
    },
    {
      dms: {
        degrees: 77,
        minutes: 2,
        seconds: 11,
        direction: "W",
      },
      expectedDecimalDegrees: -77.036389,
    },
    {
      dms: {
        degrees: 33,
        minutes: 51,
        seconds: 24.42384,
        direction: "S",
      },
      expectedDecimalDegrees: -33.8567844,
    },
    {
      dms: {
        degrees: 151,
        minutes: 12,
        seconds: 55.06812,
        direction: "E",
      },
      expectedDecimalDegrees: 151.2152967,
    },
  ] as const)(
    "should parse $dms to $expectedDecimalDegrees",
    ({ expectedDecimalDegrees, dms }) => {
      expect(dmsToDecimalDegrees(dms)).toBeCloseTo(expectedDecimalDegrees);
    },
  );

  describe("edge cases", () => {
    test.each([
      {
        dms: { degrees: 0, minutes: 0, seconds: 0, direction: "N" },
        expectedDecimalDegrees: 0,
      },
      {
        dms: { degrees: 0, minutes: 0, seconds: 0, direction: "E" },
        expectedDecimalDegrees: 0,
      },
      {
        // South pole
        dms: { degrees: 90, minutes: 0, seconds: 0, direction: "S" },
        expectedDecimalDegrees: -90,
      },
      {
        // North pole
        dms: { degrees: 90, minutes: 0, seconds: 0, direction: "N" },
        expectedDecimalDegrees: 90,
      },
      {
        // Pacific Ocean (International Date Line) (direction can be either W or E)
        dms: { degrees: 180, minutes: 0, seconds: 0, direction: "W" },
        expectedDecimalDegrees: -180,
      },
      {
        dms: { degrees: 180, minutes: 0, seconds: 0, direction: "E" },
        expectedDecimalDegrees: 180,
      },
    ] as const)(
      "should parse $dms to $expectedDecimalDegrees",
      ({ expectedDecimalDegrees, dms }) => {
        expect(dmsToDecimalDegrees(dms)).toBeCloseTo(expectedDecimalDegrees);
      },
    );
  });
});
