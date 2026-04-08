import { mapRationalToObject, type ExifContent } from "libexif-wasm";

import type { DMS } from "#lib/leaflet/interfaces";

import { getRequiredEntry } from "../getRequiredEntry";
import { parseCoordinateEntry } from "./parseCoordinateEntry";

const formatCoordinate = ({
  degrees,
  minutes,
  seconds,
  direction,
}: DMS): string => {
  return `${degrees}°${minutes}\u2032${seconds}″ ${direction}`;
};

const formatLatLngFromExif = (exifDataGpsIfd: ExifContent): string => {
  const latitude = formatCoordinate(
    parseCoordinateEntry(
      getRequiredEntry(exifDataGpsIfd, "LATITUDE"),
      getRequiredEntry(exifDataGpsIfd, "LATITUDE_REF"),
    ),
  );
  const longitude = formatCoordinate(
    parseCoordinateEntry(
      getRequiredEntry(exifDataGpsIfd, "LONGITUDE"),
      getRequiredEntry(exifDataGpsIfd, "LONGITUDE_REF"),
    ),
  );

  const altitudeEntry = exifDataGpsIfd.getEntry("ALTITUDE");
  const altitudeRefEntry = exifDataGpsIfd.getEntry("ALTITUDE_REF");

  if (altitudeEntry !== null && altitudeRefEntry !== null) {
    const altitude = mapRationalToObject(altitudeEntry.toTypedArray())[0];
    if (altitude !== undefined) {
      const isSeaLevel = altitudeRefEntry.data[0] === 0;
      return `${latitude} ${longitude} ${!isSeaLevel ? "\u2212" : ""}${altitude.numerator / altitude.denominator}m`;
    }
  }

  return `${latitude} ${longitude}`;
};

export { formatLatLngFromExif };
