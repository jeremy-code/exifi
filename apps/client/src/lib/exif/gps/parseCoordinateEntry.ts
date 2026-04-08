import { mapRationalToObject, type ExifEntry } from "libexif-wasm";

import { isDirection, type DMS } from "#lib/leaflet/interfaces";

const parseCoordinateEntry = (
  coordinateEntry: ExifEntry,
  coordinateRefEntry: ExifEntry,
): DMS => {
  const [degrees, minutes, seconds] = mapRationalToObject(
    coordinateEntry.toTypedArray(),
  ).map((rational) => rational.numerator / rational.denominator);
  const coordinateRef = coordinateRefEntry.toString();

  if (degrees === undefined || minutes === undefined || seconds === undefined) {
    throw new Error(
      `Exif entry "${coordinateEntry.tag}" has a corrupted value: ${coordinateEntry.toString()}.`,
    );
  }
  if (!isDirection(coordinateRef)) {
    throw new Error(
      `Exif entry "${coordinateRefEntry.tag}" has an invalid value: ${coordinateRefEntry.toString()}.`,
    );
  }

  return { degrees, minutes, seconds, direction: coordinateRef };
};

export { parseCoordinateEntry };
