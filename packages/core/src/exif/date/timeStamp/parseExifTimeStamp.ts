import { Time } from "@internationalized/date";
import { Decimal } from "decimal.js";
import { mapRationalToObject } from "libexif-wasm";

const MILLISECONDS_IN_SECOND = 1000;

const parseExifTimeStamp = (value: ArrayLike<number>) => {
  const timeStampValue = mapRationalToObject(new Uint32Array(value));

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
    new Decimal(hour.numerator).div(hour.denominator).toNumber(),
    new Decimal(minute.numerator).div(minute.denominator).toNumber(),
    new Decimal(second.numerator).div(second.denominator).floor().toNumber(),
    millisecond,
  );
};

export { parseExifTimeStamp };
