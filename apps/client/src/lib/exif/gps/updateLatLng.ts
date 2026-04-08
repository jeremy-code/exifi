import type { LatLng } from "leaflet";
import { mapRationalFromObject, type ExifContent } from "libexif-wasm";

import { decimalDegreesToDms } from "#lib/leaflet/decimalDegreesToDms";
import { approximateRational } from "#lib/math/approximateRational";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

import { getOrInsertEntry } from "../getOrInsertEntry";

const MAX_UINT32_VALUE = 0xffffffff;

const updateLatLng = (exifDataGpsIfd: ExifContent, latLng: LatLng) => {
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
};

export { updateLatLng };
