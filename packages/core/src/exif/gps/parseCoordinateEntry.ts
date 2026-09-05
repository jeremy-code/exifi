import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";

import { dmsToDecimalDegrees } from "../../geo/dmsToDecimalDegrees";
import { isDirection } from "../../geo/interfaces";

const parseCoordinateEntry = (
  coordinateArray: RationalObject[],
  // W, S, E, N, Sea level, or Sea level reference
  coordinateRef: string,
): number | null => {
  const mappedCoordinateArray = coordinateArray.map((rational) =>
    new Decimal(rational.numerator).div(rational.denominator).toNumber(),
  );
  if (coordinateArray.length === 3) {
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
  } else if (coordinateArray.length === 1) {
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
