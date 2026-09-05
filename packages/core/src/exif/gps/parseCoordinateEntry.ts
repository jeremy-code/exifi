import { dmsToDecimalDegrees } from "@exifi/core/leaflet/dmsToDecimalDegrees";
import { isDirection } from "@exifi/core/leaflet/interfaces";

import { mapRationalArray } from "../utils/mapRationalArray";

const parseCoordinateEntry = (
  // Any iterable of numbers of format [numerator1, denominator1, numerator2, denominator2, ...]
  coordinateArray: ArrayLike<number>,
  // W, S, E, N, Sea level, or Sea level reference
  coordinateRef: string,
): number | null => {
  if (coordinateArray.length % 2 !== 0) {
    return null;
  }

  const mappedCoordinateArray = mapRationalArray(coordinateArray).map(
    (rational) => rational.valueOf(),
  );
  if (coordinateArray.length === 6) {
    const [degrees, minutes, seconds] = mappedCoordinateArray;

    if (
      degrees === undefined ||
      minutes === undefined ||
      seconds === undefined ||
      !isDirection(coordinateRef)
    ) {
      return null;
    }

    return dmsToDecimalDegrees({
      degrees,
      minutes,
      seconds,
      direction: coordinateRef,
    });
  } else if (coordinateArray.length === 2) {
    const [altitude] = mappedCoordinateArray;
    if (
      altitude === undefined ||
      (coordinateRef !== "Sea level" && coordinateRef !== "Sea level reference")
    ) {
      return null;
    }

    return coordinateRef === "Sea level" ? altitude : -altitude;
  }

  return null;
};

export { parseCoordinateEntry };
