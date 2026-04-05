import type { ExifEntry } from "libexif-wasm";

import { isDirection, type DMS } from "#lib/leaflet/interfaces";
import { Rational } from "#lib/math/Rational";

import { getEntryValue } from "../getEntryValue";

const parseCoordinateEntry = (
  coordinateEntry: ExifEntry,
  coordinateRefEntry: ExifEntry,
): DMS => {
  const [degrees, minutes, seconds] = [...getEntryValue(coordinateEntry)]
    .filter((coordinate) => coordinate instanceof Rational)
    .map((rational) => rational.valueOf());
  const coordinateRef = coordinateRefEntry.value;

  if (degrees === undefined || minutes === undefined || seconds === undefined) {
    throw new Error(
      `Exif entry "${coordinateEntry.tag}" has a corrupted value: ${coordinateEntry.value}.`,
    );
  }
  if (!isDirection(coordinateRef)) {
    throw new Error(
      `Exif entry "${coordinateRefEntry.tag}" has an invalid value: ${coordinateRefEntry.value}.`,
    );
  }

  return { degrees, minutes, seconds, direction: coordinateRef };
};

export { parseCoordinateEntry };
