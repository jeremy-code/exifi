import { Time } from "@internationalized/date";
import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";

import { MAX_UINT32_VALUE } from "../constants";

const MILLISECONDS_IN_SECOND = 1000;

const formatTimeStamp = (value: Time): number[] => {
  return [
    value.hour,
    value.minute,
    new Decimal(value.second).plus(
      new Decimal(value.millisecond).div(MILLISECONDS_IN_SECOND),
    ),
  ].flatMap((timeComponent) =>
    new Decimal(timeComponent)
      .toFraction(MAX_UINT32_VALUE)
      .map((value) => value.toNumber()),
  );
};

const parseTimeStamp = (value: RationalObject[]) => {
  if (value.length !== 3) {
    throw new Error(
      `Unexpected number of inputs for tag TIME_STAMP, expected 3, got ${value.length}`,
    );
  }
  const [hour, minute, second] = value;
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
    new Decimal(second.numerator).div(hour.denominator).floor().toNumber(),
    millisecond,
  );
};

export { parseTimeStamp, formatTimeStamp };
