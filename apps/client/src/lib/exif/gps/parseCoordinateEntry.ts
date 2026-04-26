import { dmsToDecimalDegrees } from "#lib/leaflet/dmsToDecimalDegrees";
import { isDirection } from "#lib/leaflet/interfaces";

import { mapRationalArray } from "../mapRationalArray";

const parseCoordinateEntry = (
  // Any iterable of numbers of format [numerator1, denominator1, numerator2, denominator2, ...]
  coordinateArray: ArrayLike<number>,
  // W or S or E or N
  coordinateRef: string,
): number | null => {
  if (coordinateArray.length === 6) {
    const [degrees, minutes, seconds] = mapRationalArray(coordinateArray);

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
    const [altitude] = mapRationalArray(coordinateArray);
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
