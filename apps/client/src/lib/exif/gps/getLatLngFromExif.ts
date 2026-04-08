import { LatLng } from "leaflet";
import { mapRationalToObject, type ExifContent } from "libexif-wasm";

import { dmsToDecimalDegrees } from "#lib/leaflet/dmsToDecimalDegrees";

import { parseCoordinateEntry } from "./parseCoordinateEntry";
import { getRequiredEntry } from "../getRequiredEntry";

const getLatLngFromExif = (exifDataGpsIfd: ExifContent): LatLng => {
  const latitude = dmsToDecimalDegrees(
    parseCoordinateEntry(
      getRequiredEntry(exifDataGpsIfd, "LATITUDE"),
      getRequiredEntry(exifDataGpsIfd, "LATITUDE_REF"),
    ),
  );
  const longitude = dmsToDecimalDegrees(
    parseCoordinateEntry(
      getRequiredEntry(exifDataGpsIfd, "LONGITUDE"),
      getRequiredEntry(exifDataGpsIfd, "LONGITUDE_REF"),
    ),
  );

  const altitudeEntry = exifDataGpsIfd.getEntry("ALTITUDE");
  const altitudeRefEntry = exifDataGpsIfd.getEntry("ALTITUDE_REF");

  if (altitudeEntry !== null && altitudeRefEntry !== null) {
    const absoluteAltitude = mapRationalToObject(
      altitudeEntry.toTypedArray(),
    )[0];
    if (absoluteAltitude !== undefined) {
      const isSeaLevel = altitudeRefEntry.toTypedArray()[0] === 0;
      const altitude =
        isSeaLevel ?
          absoluteAltitude.numerator / absoluteAltitude.denominator
        : -(absoluteAltitude.numerator / absoluteAltitude.denominator);
      return new LatLng(latitude, longitude, altitude);
    }
  }

  return new LatLng(latitude, longitude);
};

export { getLatLngFromExif };
