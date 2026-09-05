import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";

const approximateRational = (
  value: Decimal.Value,
  maxNumerator?: Decimal.Value,
): RationalObject => {
  const [numerator, denominator] = new Decimal(value).toFraction(maxNumerator);

  return {
    numerator: numerator.toNumber(),
    denominator: denominator.toNumber(),
  };
};

export { approximateRational };
