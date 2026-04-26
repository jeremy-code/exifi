import { LatLng } from "leaflet";
import { type ExifContent } from "libexif-wasm";

import { parseCoordinateEntry } from "./parseCoordinateEntry";
import { getRequiredEntry } from "../getRequiredEntry";

const getLatLngFromExif = (exifDataGpsIfd: ExifContent): LatLng => {
  const latitude = parseCoordinateEntry(
    getRequiredEntry(exifDataGpsIfd, "LATITUDE").toTypedArray(),
    getRequiredEntry(exifDataGpsIfd, "LATITUDE_REF").toString(),
  );
  const longitude = parseCoordinateEntry(
    getRequiredEntry(exifDataGpsIfd, "LONGITUDE").toTypedArray(),
    getRequiredEntry(exifDataGpsIfd, "LONGITUDE_REF").toString(),
  );

  if (latitude === null || longitude === null) {
    throw new Error(`An invalid latitude or longitude was given`);
  }

  const altitudeEntry = exifDataGpsIfd.getEntry("ALTITUDE");
  const altitudeRefEntry = exifDataGpsIfd.getEntry("ALTITUDE_REF");

  if (altitudeEntry !== null && altitudeRefEntry !== null) {
    const altitude = parseCoordinateEntry(
      altitudeEntry.toTypedArray(),
      altitudeRefEntry.toString(),
    );

    return new LatLng(latitude, longitude, altitude ?? undefined);
  }

  return new LatLng(latitude, longitude);
};

export { getLatLngFromExif };
