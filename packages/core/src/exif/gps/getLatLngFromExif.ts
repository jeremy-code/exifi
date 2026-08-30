import { mapRationalToObject, type ExifContent } from "libexif-wasm";

import { parseCoordinateEntry } from "./parseCoordinateEntry";
import type { LatLng } from "../../geo/interfaces";
import { getRequiredEntry } from "../utils/getRequiredEntry";

const getLatLngFromExif = (exifDataGpsIfd: ExifContent): LatLng => {
  const latitude = parseCoordinateEntry(
    mapRationalToObject(
      getRequiredEntry(exifDataGpsIfd, "LATITUDE").toTypedArray(),
    ),
    getRequiredEntry(exifDataGpsIfd, "LATITUDE_REF").toString(),
  );
  const longitude = parseCoordinateEntry(
    mapRationalToObject(
      getRequiredEntry(exifDataGpsIfd, "LONGITUDE").toTypedArray(),
    ),
    getRequiredEntry(exifDataGpsIfd, "LONGITUDE_REF").toString(),
  );

  if (latitude === null || longitude === null) {
    throw new Error(`An invalid latitude or longitude was given`);
  }

  const altitudeEntry = exifDataGpsIfd.getEntry("ALTITUDE");
  const altitudeRefEntry = exifDataGpsIfd.getEntry("ALTITUDE_REF");

  if (altitudeEntry !== null && altitudeRefEntry !== null) {
    const altitude = parseCoordinateEntry(
      mapRationalToObject(altitudeEntry.toTypedArray()),
      altitudeRefEntry.toString(),
    );

    return { lat: latitude, lng: longitude, alt: altitude ?? undefined };
  }

  return { lat: latitude, lng: longitude };
};

export { getLatLngFromExif };
