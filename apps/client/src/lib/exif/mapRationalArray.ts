import { Decimal } from "decimal.js";

const mapRationalArray = (numberArray: ArrayLike<number>) => {
  if (numberArray.length % 2 !== 0) {
    throw new Error(
      "Rational array has an odd number of values, indicating a missing denominator",
    );
  }

  const rationalArray: number[] = [];

  for (let index = 0; index < numberArray.length / 2; index++) {
    const numerator = numberArray[index * 2];
    const denominator = numberArray[index * 2 + 1];

    if (numerator === undefined) {
      throw new Error(`numberArray was undefined at index ${index * 2}`);
    }
    if (denominator === undefined) {
      throw new Error(`numberArray was undefined at index ${index * 2 + 1}`);
    }
    rationalArray.push(new Decimal(numerator).div(denominator).toNumber());
  }

  return rationalArray;
};

export { mapRationalArray };
