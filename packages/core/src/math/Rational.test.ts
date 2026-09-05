import { describe, expect, test } from "vitest";

import { Rational } from "./Rational";

describe("Rational", () => {
  describe("constructor", () => {
    describe("valid inputs", () => {
      test.for([
        {
          numerator: 1,
          denominator: 2,
          expected: { numerator: 1, denominator: 2 },
        },
        {
          numerator: -3,
          denominator: 4,
          expected: { numerator: -3, denominator: 4 },
        },
        {
          numerator: 0,
          denominator: 5,
          expected: { numerator: 0, denominator: 5 },
        },
      ])(
        "constructs ($numerator, $denominator)",
        ({ numerator, denominator, expected }) => {
          const rational = new Rational(numerator, denominator);
          expect(rational).toHaveProperty("numerator", expected.numerator);
          expect(rational).toHaveProperty("denominator", expected.denominator);
        },
      );
    });

    describe("sign normalization", () => {
      test.for([
        {
          numerator: 3,
          denominator: -4,
          expected: { numerator: -3, denominator: 4 },
        },
        {
          numerator: -1,
          denominator: 8,
          expected: { numerator: -1, denominator: 8 },
        },
        {
          numerator: -0,
          denominator: -1,
          expected: { numerator: 0, denominator: 1 },
        },
        // Really should be 0/1 but since negative zero exists in JavaScript...
        {
          numerator: 0,
          denominator: -1,
          expected: { numerator: -0, denominator: 1 },
        },
      ])(
        "normalizes ($numerator, $denominator)",
        ({ numerator, denominator, expected }) => {
          const rational = new Rational(numerator, denominator);
          expect(rational).toHaveProperty("numerator", expected.numerator);
          expect(rational).toHaveProperty("denominator", expected.denominator);
        },
      );
    });

    describe("invalid inputs", () => {
      test.for([
        { numerator: 1, denominator: 0 },
        { numerator: 1, denominator: -0 },
        { numerator: 1.5, denominator: 2 },
        { numerator: 1, denominator: 2.5 },
        { numerator: NaN, denominator: 2 },
        { numerator: 1, denominator: NaN },
        { numerator: Infinity, denominator: 2 },
        { numerator: 1, denominator: Infinity },
      ])(
        "throws RangeError for ($numerator, $denominator)",
        ({ numerator, denominator }) => {
          expect(() => new Rational(numerator, denominator)).toThrow(
            RangeError,
          );
        },
      );
    });
  });

  describe("toString()", () => {
    test.for([
      { numerator: 3, denominator: 4, expected: "3/4" },
      { numerator: -3, denominator: 4, expected: "-3/4" },
      { numerator: 3, denominator: -4, expected: "-3/4" },
      { numerator: 0, denominator: 7, expected: "0/7" },
    ])(
      "formats ($numerator, $denominator)",
      ({ numerator, denominator, expected }) => {
        expect(new Rational(numerator, denominator).toString()).toBe(expected);
      },
    );

    test.for([
      { numerator: 0xff, denominator: 0x10, radix: 16, expected: "ff/10" },
    ])(
      "formats ($numerator, $denominator) with radix $radix",
      ({ numerator, denominator, radix, expected }) => {
        expect(new Rational(numerator, denominator).toString(radix)).toBe(
          expected,
        );
      },
    );
  });

  describe("valueOf()", () => {
    test.for([
      { numerator: 1, denominator: 2, expected: 0.5 },
      { numerator: -1, denominator: 4, expected: -0.25 },
      { numerator: 0, denominator: 99, expected: 0 },
    ])("returns $expected", ({ numerator, denominator, expected }) => {
      expect(new Rational(numerator, denominator).valueOf()).toBe(expected);
    });

    test("supports comparisons", () => {
      expect(new Rational(1, 2) > new Rational(1, 3)).toBe(true);
      expect(new Rational(1, 3) < new Rational(1, 2)).toBe(true);
    });

    test("supports arithmetic via coercion", () => {
      // @ts-expect-error intentional coercion
      expect(new Rational(1, 4) + new Rational(1, 4)).toBe(0.5);
    });
  });
});
