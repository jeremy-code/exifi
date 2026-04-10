import type { LatLng } from "leaflet";
import { mapRationalFromObject, type ExifContent } from "libexif-wasm";

import { decimalDegreesToDms } from "#lib/leaflet/decimalDegreesToDms";
import { approximateRational } from "#lib/math/approximateRational";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

import { getOrInsertEntry } from "../getOrInsertEntry";

const MAX_UINT32_VALUE = 0xffffffff;

const updateLatLng = (exifDataGpsIfd: ExifContent, latLng: LatLng) => {
  /**
   * If it doesn't already exist, add the GPS VERSION_ID tag and initialize it
   * with value 2.2.0.0
   */
  if (exifDataGpsIfd.getEntry("VERSION_ID") === null) {
    const versionIdEntry = getOrInsertEntry(exifDataGpsIfd, "VERSION_ID");
    versionIdEntry.format = "BYTE";
    versionIdEntry.data = new Uint8Array([0x02, 0x02, 0x00, 0x00]);
    versionIdEntry.components = 4;
  }

  const latitude = decimalDegreesToDms(latLng.lat, "lat");
  const longitude = decimalDegreesToDms(latLng.lng, "lng");

  const latitudeEntry = getOrInsertEntry(exifDataGpsIfd, "LATITUDE");
  const latitudeRefEntry = getOrInsertEntry(exifDataGpsIfd, "LATITUDE_REF");
  const longitudeEntry = getOrInsertEntry(exifDataGpsIfd, "LONGITUDE");
  const longitudeRefEntry = getOrInsertEntry(exifDataGpsIfd, "LONGITUDE_REF");

  latitudeEntry.format = "RATIONAL";
  latitudeRefEntry.format = "ASCII";
  longitudeEntry.format = "RATIONAL";
  longitudeRefEntry.format = "ASCII";

  latitudeRefEntry.fromTypedArray(encodeStringToUtf8(latitude.direction));
  longitudeRefEntry.fromTypedArray(encodeStringToUtf8(longitude.direction));
  latitudeEntry.fromTypedArray(
    mapRationalFromObject(
      [latitude.degrees, latitude.minutes, latitude.seconds].map((value) =>
        approximateRational(
          value,
          undefined,
          undefined,
          MAX_UINT32_VALUE,
          MAX_UINT32_VALUE,
        ),
      ),
      "RATIONAL",
    ),
  );
  longitudeEntry.fromTypedArray(
    mapRationalFromObject(
      [longitude.degrees, longitude.minutes, longitude.seconds].map((value) =>
        approximateRational(
          value,
          undefined,
          undefined,
          MAX_UINT32_VALUE,
          MAX_UINT32_VALUE,
        ),
      ),
      "RATIONAL",
    ),
  );

  if (latLng.alt !== undefined) {
    const altitudeEntry = getOrInsertEntry(exifDataGpsIfd, "ALTITUDE");
    const altitudeRefEntry = getOrInsertEntry(exifDataGpsIfd, "ALTITUDE_REF");
    altitudeEntry.format = "RATIONAL";
    altitudeRefEntry.format = "BYTE"; // For some reason, Altitude is BYTE and not ASCII
    altitudeEntry.fromTypedArray(
      mapRationalFromObject(
        [
          approximateRational(
            latLng.alt,
            undefined,
            undefined,
            MAX_UINT32_VALUE,
            MAX_UINT32_VALUE,
          ),
        ],
        "RATIONAL",
      ),
    );
    altitudeRefEntry.fromTypedArray(
      new Uint8Array([Math.sign(latLng.alt) >= 0 ? 0 : 1]),
    );
  }
};

export { updateLatLng };
