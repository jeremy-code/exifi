import { Decimal } from "decimal.js";

const DEFAULT_MAX_ITERATIONS = 10;
const DEFAULT_TOLERANCE = 1e-10; // = 1/10_000_000_000

/**
 * Computes the continued fraction coefficients [a_0, a_1, ..., a_n] for a
 * **non-negative** finite number
 *
 * @see {@link https://en.wikipedia.org/wiki/Simple_continued_fraction}
 */
const getContinuedFraction = (
  value: Decimal.Value,
  maxIterations = DEFAULT_MAX_ITERATIONS,
  tolerance = DEFAULT_TOLERANCE,
): number[] => {
  const coefficients: number[] = [];
  let remainder = new Decimal(value);

  for (let i = 0; i < maxIterations; i++) {
    const integerPart = remainder.floor();
    const fractionalPart = remainder.minus(integerPart);
    coefficients.push(integerPart.toNumber());

    // The remainder is negligible — there exists a sufficiently close rational
    // representation.
    if (fractionalPart.lessThan(tolerance)) {
      break;
    }

    // Reciprocal of the fractional part becomes the next coefficient
    remainder = Decimal.div(1, fractionalPart);
  }

  return coefficients;
};

type RationalObject = {
  numerator: number;
  denominator: number;
};

/**
 * Approximates a finite real number as a rational p/q using the continued
 * fractions.
 *
 * The returned fraction always has a positive denominator, and the sign of the
 * input is carried by the numerator.
 */
const approximateRational = (
  value: number,
  maxIterations = DEFAULT_MAX_ITERATIONS,
  tolerance = DEFAULT_TOLERANCE,
  maxNumerator?: number,
  maxDenominator?: number,
): RationalObject => {
  if (!Number.isFinite(value)) {
    throw new RangeError(
      `value must be a finite number, but received: ${value}`,
    );
  }
  if (!Number.isInteger(maxIterations) || maxIterations < 1) {
    throw new RangeError(
      `maxIterations must be a positive integer, but received: ${maxIterations}`,
    );
  }
  if (!Number.isFinite(tolerance) || tolerance < 0) {
    throw new RangeError(
      `tolerance must be a non-negative finite number, but received: ${tolerance}`,
    );
  }

  if (value < 0) {
    const rational = approximateRational(
      -value,
      maxIterations,
      tolerance,
      maxNumerator,
      maxDenominator,
    );
    return {
      numerator: -rational.numerator,
      denominator: rational.denominator,
    };
  }

  const coefficients = getContinuedFraction(value, maxIterations, tolerance);

  if (coefficients.length === 0) {
    throw new RangeError(
      "Cannot build a convergent from an empty coefficient list.",
    );
  }

  let p2 = 0;
  let q2 = 1; // p_{k-2}, q_{k-2}
  let p1 = 1;
  let q1 = 0; // p_{k-1}, q_{k-1}

  // Tracks the last convergent that was within bounds. Starts undefined so we
  // can detect the edge case where even the first convergent (a_0/1) is too big.
  let lastValid: RationalObject | undefined;

  for (const a of coefficients) {
    const p = a * p1 + p2;
    const q = a * q1 + q2;

    if (
      (maxNumerator !== undefined && p > maxNumerator) ||
      (maxDenominator !== undefined && q > maxDenominator)
    ) {
      // This convergent overshoots — stop and use the previous one.
      break;
    }

    lastValid = { numerator: p, denominator: q };
    p2 = p1;
    q2 = q1;
    p1 = p;
    q1 = q;
  }

  if (lastValid === undefined) {
    if (maxNumerator === undefined || maxDenominator === undefined) {
      throw new Error(
        "Unable to find convergent despite numerator and denomintor not being constrained",
      );
    }

    // Even a_0/1 exceeded bounds. The best we can do is clamp to the integer
    // part or, if that is also 0, return 0/1.
    return {
      numerator: Math.min(coefficients[0]!, maxNumerator),
      denominator: 1,
    };
  }

  return lastValid;
};

export { getContinuedFraction, approximateRational };
