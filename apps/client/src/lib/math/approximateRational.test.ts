import { describe, expect, test } from "vitest";

import {
  approximateRational,
  getContinuedFraction,
} from "./approximateRational";

describe("getContinuedFraction", () => {
  test("get continued fraction", () => {
    expect(getContinuedFraction(3.245)).toEqual([3, 4, 12, 4]);
    expect(getContinuedFraction(2.875)).toEqual([2, 1, 7]);
  });
});

const RATIONAL_CASES = [
  { value: 3.245, expectedValue: { numerator: 649, denominator: 200 } },
  /* X_RESOLUTION, Y_RESOLUTION */
  { value: 300, expectedValue: { numerator: 300, denominator: 1 } },
  { value: 72, expectedValue: { numerator: 72, denominator: 1 } },
  /* EXPOSURE_TIME (1/1600 sec.) */
  { value: 0.000625, expectedValue: { numerator: 1, denominator: 1600 } },
  /* FNUMBER (f/1.7) */
  { value: 1.7, expectedValue: { numerator: 17, denominator: 10 } },
  /* MAX_APERTURE_VALUE (1.53 EV (f/1.7)) */
  { value: 1.53, expectedValue: { numerator: 153, denominator: 100 } },
  /* LATITUDE (26, 34.9510, 0) */
  { value: 26, expectedValue: { numerator: 26, denominator: 1 } },
  { value: 0, expectedValue: { numerator: 0, denominator: 1 } },
  /* LONGITUDE (80, 12.0140, 0) */
  { value: 80, expectedValue: { numerator: 80, denominator: 1 } },
  { value: 0, expectedValue: { numerator: 0, denominator: 1 } },
  /* ALTITUDE (1) */
  { value: 0, expectedValue: { numerator: 0, denominator: 1 } },
];

/**
 * These test cases are based on Exif data that for likely due to floating point
 * math, `approximateRational` does not produce the correct rational
 */
const MISC_RATIONAL_CASES = [
  /* APERTURE_VALUE (1.53 EV (f/1.7)) */
  {
    value: 1.531069,
    unexpectedValue: {
      denominator: 2591,
      numerator: 3967,
    },
    expectedValue: { numerator: 1_531_069, denominator: 1_000_000 },
  },
  /* FOCAL_LENGTH (4.2 mm) */
  {
    value: 4.2,
    // This value is correct, just reduced
    unexpectedValue: { numerator: 21, denominator: 5 },
    expectedValue: { numerator: 420, denominator: 100 },
  },
  /* LATITUDE () */
  {
    value: 34.951,
    unexpectedValue: { numerator: 34_951, denominator: 1000 },
    expectedValue: { numerator: 349_510, denominator: 10_000 },
  },
  /* LONGITUDE (80, 12.0140, 0) */
  {
    value: 12.014,
    unexpectedValue: { numerator: 6007, denominator: 500 },
    expectedValue: { numerator: 120140, denominator: 10000 },
  },
];

describe("approximateRational", () => {
  describe("approximates rationals", () => {
    test.each(RATIONAL_CASES)(
      "should return the correct rational for value $value",
      ({ value, expectedValue }) => {
        const rational = approximateRational(value);
        expect(rational.numerator / rational.denominator).toBeCloseTo(value, 0);
        expect(rational).toStrictEqual(expectedValue);
      },
    );
  });
  describe("approximates rational edge cases", () => {
    test.each(MISC_RATIONAL_CASES)(
      "should return the correct rational for value $value",
      ({ value, unexpectedValue }) => {
        const rational = approximateRational(value);
        expect(rational.numerator / rational.denominator).toBeCloseTo(value, 0);
        expect(rational).toStrictEqual(unexpectedValue);
      },
    );
  });
});
