import { Decimal } from "decimal.js";

import { assertNever } from "#utils/assertNever";

import type { DMS, Direction, Axis } from "./interfaces";

const MINUTES_IN_DEGREE = 60;
const SECONDS_IN_MINUTE = 60;

/**
 * Converts decimal degrees to DMS (Degrees, Minutes, Seconds)
 *
 * @param decimal - decimal degree value (e.g. -118.2437)
 * @param axis - whether this is latitude ("lat") or longitude ("lng")
 */
const decimalDegreesToDms = (decimalDegrees: number, axis: Axis): DMS => {
  const absoluteDecimalDegrees = new Decimal(decimalDegrees).absoluteValue();
  const degrees = absoluteDecimalDegrees.truncated();

  const minutesFull = absoluteDecimalDegrees
    .minus(degrees)
    .mul(MINUTES_IN_DEGREE);
  const minutes = minutesFull.truncated();

  const seconds = minutesFull
    .minus(minutes)
    .mul(SECONDS_IN_MINUTE)
    // Per https://en.wikipedia.org/wiki/Decimal_degrees#Precision, at 8 decimal
    // palaces, specializing surveying can be done, which is probably overkill
    .toDecimalPlaces(6);

  const direction: Direction =
    axis === "lat" ?
      decimalDegrees < 0 ?
        "S"
      : "N"
    : axis === "lng" ?
      decimalDegrees < 0 ?
        "W"
      : "E"
    : assertNever(axis);

  return {
    degrees: degrees.toNumber(),
    minutes: minutes.toNumber(),
    seconds: seconds.toNumber(),
    direction,
  };
};

export { decimalDegreesToDms };
