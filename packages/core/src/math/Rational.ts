import type { RationalObject } from "libexif-wasm";

import { approximateRational } from "./approximateRational";

class Rational {
  readonly numerator: number;
  readonly denominator: number;

  constructor(numerator: number, denominator: number) {
    if (!Number.isInteger(numerator)) {
      throw new RangeError("numerator must be an integer");
    }
    if (!Number.isInteger(denominator)) {
      throw new RangeError("denominator must be an integer");
    }
    if (denominator === 0) {
      throw new RangeError("Division by zero");
    }

    if (Math.sign(denominator) === -1) {
      this.numerator = -numerator;
      this.denominator = -denominator;
    } else {
      this.numerator = numerator;
      this.denominator = denominator;
    }
  }

  static fromNumber(value: number, maxNumerator?: number) {
    const rational = approximateRational(value, maxNumerator);
    return new Rational(rational.numerator, rational.denominator);
  }

  static fromObject({ numerator, denominator }: RationalObject) {
    return new Rational(numerator, denominator);
  }

  toString(radix?: number) {
    return `${this.numerator.toString(radix)}/${this.denominator.toString(radix)}`;
  }

  valueOf() {
    return this.numerator / this.denominator;
  }
}

export { Rational };
