import type { ExifEntry } from "libexif-wasm";

import { isDirection, type DMS } from "#lib/leaflet/interfaces";

import { getEntryValue } from "../getEntryValue";
import { isRational } from "../interfaces";

const parseCoordinateEntry = (
  coordinateEntry: ExifEntry,
  coordinateRefEntry: ExifEntry,
): DMS => {
  const [degrees, minutes, seconds] = [...getEntryValue(coordinateEntry)]
    .filter((coordinate) => isRational(coordinate))
    .map((rational) => rational.numerator / rational.denominator);
  const coordinateRef = coordinateRefEntry.getValue();

  if (degrees === undefined || minutes === undefined || seconds === undefined) {
    throw new Error(
      `Exif entry "${coordinateEntry.tag}" has a corrupted value: ${coordinateEntry.getValue()}.`,
    );
  }
  if (!isDirection(coordinateRef)) {
    throw new Error(
      `Exif entry "${coordinateRefEntry.tag}" has an invalid value: ${coordinateRefEntry.getValue()}.`,
    );
  }

  return { degrees, minutes, seconds, direction: coordinateRef };
};

export { parseCoordinateEntry };
