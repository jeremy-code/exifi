import { describe, expect, test } from "vitest";

import { decimalDegreesToDms } from "./decimalDegreesToDms";

describe("decimalDegreesToDms", () => {
  test.for([
    {
      decimalDegrees: 38.897778,
      axis: "lat",
      expected: {
        degrees: 38,
        minutes: 53,
        seconds: 52,
        direction: "N",
      },
    },
    {
      decimalDegrees: -77.036389,
      axis: "lng",
      expected: {
        degrees: 77,
        minutes: 2,
        seconds: 11,
        direction: "W",
      },
    },
    {
      decimalDegrees: -33.8567844,
      axis: "lat",
      expected: {
        degrees: 33,
        minutes: 51,
        seconds: 24.42384,
        direction: "S",
      },
    },
    {
      decimalDegrees: 151.2152967,
      axis: "lng",
      expected: {
        degrees: 151,
        minutes: 12,
        seconds: 55.06812,
        direction: "E",
      },
    },
  ] as const)(
    "should parse $decimalDegrees to $expected",
    ({ decimalDegrees, axis, expected }) => {
      const { seconds: expectedSeconds, ...expectedDm } = expected;
      const dms = decimalDegreesToDms(decimalDegrees, axis);
      expect(dms).toMatchObject(expectedDm);
      expect(dms.seconds).toBeCloseTo(expectedSeconds);
    },
  );

  describe("edge cases", () => {
    test.each([
      {
        decimalDegrees: 0,
        axis: "lat",
        expected: { degrees: 0, minutes: 0, seconds: 0, direction: "N" },
      },
      {
        decimalDegrees: 0,
        axis: "lng",
        expected: { degrees: 0, minutes: 0, seconds: 0, direction: "E" },
      },
      {
        // South pole
        decimalDegrees: -90,
        axis: "lat",
        expected: { degrees: 90, minutes: 0, seconds: 0, direction: "S" },
      },
      {
        // North pole
        decimalDegrees: 90,
        axis: "lat",
        expected: { degrees: 90, minutes: 0, seconds: 0, direction: "N" },
      },
      {
        // Pacific Ocean (International Date Line) (direction can be either W or E)
        decimalDegrees: -180,
        axis: "lng",
        expected: { degrees: 180, minutes: 0, seconds: 0, direction: "W" },
      },
      {
        decimalDegrees: 180,
        axis: "lng",
        expected: { degrees: 180, minutes: 0, seconds: 0, direction: "E" },
      },
    ] as const)(
      "should parse $decimalDegrees to $expected",
      ({ decimalDegrees, axis, expected }) => {
        const { seconds: expectedSeconds, ...expectedDm } = expected;
        const dms = decimalDegreesToDms(decimalDegrees, axis);
        expect(dms).toMatchObject(expectedDm);
        expect(dms.seconds).toBeCloseTo(expectedSeconds);
      },
    );
  });
});
