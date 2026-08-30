import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";

import { dmsToDecimalDegrees } from "#lib/leaflet/dmsToDecimalDegrees";
import { isDirection } from "#lib/leaflet/interfaces";

const parseCoordinateEntry = (
  coordinateArray: RationalObject[],
  // W, S, E, N, Sea level, or Sea level reference
  coordinateRef: string,
): number | null => {
  if (coordinateArray.length % 2 !== 0) {
    return null;
  }

  const mappedCoordinateArray = coordinateArray.map((rational) =>
    new Decimal(rational.numerator).div(rational.denominator).toNumber(),
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
