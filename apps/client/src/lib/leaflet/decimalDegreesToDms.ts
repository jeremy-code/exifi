import type { DMS, Direction } from "./interfaces";

const MINUTES_IN_DEGREE = 60;

type Axis = "lat" | "lng";

/**
 * Converts decimal degrees to DMS (Degrees, Minutes, Seconds)
 *
 * @param decimal - decimal degree value (e.g. -118.2437)
 * @param axis - whether this is latitude ("lat") or longitude ("lon")
 */
const decimalDegreesToDms = (decimal: number, axis: Axis): DMS => {
  const absolute = Math.abs(decimal);

  const degrees = Math.floor(absolute);

  const minutesFull = (absolute - degrees) * MINUTES_IN_DEGREE;
  const minutes = Math.floor(minutesFull);

  const seconds = (minutesFull - minutes) * MINUTES_IN_DEGREE;

  let direction: Direction;

  if (axis === "lat") {
    direction = decimal < 0 ? "S" : "N";
  } else {
    direction = decimal < 0 ? "W" : "E";
  }

  return {
    degrees,
    minutes,
    seconds,
    direction,
  };
};

export { decimalDegreesToDms };
