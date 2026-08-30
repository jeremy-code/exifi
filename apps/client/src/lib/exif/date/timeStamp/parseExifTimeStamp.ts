import { Time } from "@internationalized/date";
import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";

import { Rational } from "#lib/math/Rational";

const MILLISECONDS_IN_SECOND = 1000;

const parseExifTimeStamp = (value: RationalObject[]) => {
  const timeStampValue = value.map(
    (rationalObject) =>
      new Rational(rationalObject.numerator, rationalObject.denominator),
  );

  if (timeStampValue.length !== 3) {
    throw new Error(
      `Unexpected number of inputs for tag TIME_STAMP, expected 3, got ${timeStampValue.length}`,
    );
  }
  const [hour, minute, second] = timeStampValue;
  if (hour === undefined || minute === undefined || second === undefined) {
    throw new Error(
      "Hours, minutes, and seconds are required for tag TIME_STAMP",
    );
  }
  const millisecond = new Decimal(second.numerator)
    .div(second.denominator)
    .mod(1)
    .mul(MILLISECONDS_IN_SECOND)
    .toNumber();

  return new Time(
    hour.valueOf(),
    minute.valueOf(),
    Math.floor(second.valueOf()),
    millisecond,
  );
};

export { parseExifTimeStamp };
