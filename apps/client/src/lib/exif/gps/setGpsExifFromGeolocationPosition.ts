import dayjs from "dayjs";
import { LatLng } from "leaflet";
import { mapRationalFromObject, type ExifContent } from "libexif-wasm";

import { approximateRational } from "#lib/math/approximateRational";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

import { getOrInsertEntry } from "../getOrInsertEntry";
import { updateLatLng } from "./updateLatLng";

const MAX_UINT32_VALUE = 0xffffffff;

const METERS_IN_KILOMETERS = 1000;
const SECONDS_IN_HOUR = 3600;
const MILLISECONDS_IN_SECOND = 1000;

const EXIF_DATESTAMP_FORMAT = "YYYY:MM:DD";

const setGpsExifFromGeolocationPosition = (
  exifDataGpsIfd: ExifContent,
  geolocationPosition: GeolocationPosition,
) => {
  const { timestamp, coords } = geolocationPosition;
  const utcDate = dayjs(timestamp).utc();

  const dateStampEntry = getOrInsertEntry(exifDataGpsIfd, "DATE_STAMP");
  dateStampEntry.format = "ASCII";
  dateStampEntry.fromTypedArray(
    encodeStringToUtf8(utcDate.format(EXIF_DATESTAMP_FORMAT)),
  );
  const timeStampEntry = getOrInsertEntry(exifDataGpsIfd, "TIME_STAMP");
  timeStampEntry.format = "RATIONAL";
  timeStampEntry.fromTypedArray(
    mapRationalFromObject(
      [
        utcDate.hour(),
        utcDate.minute(),
        utcDate.second() + utcDate.millisecond() / MILLISECONDS_IN_SECOND,
      ].map((value) =>
        approximateRational(
          value,
          undefined,
          undefined,
          MAX_UINT32_VALUE,
          MAX_UINT32_VALUE,
        ),
      ),
    ),
  );

  updateLatLng(
    exifDataGpsIfd,
    new LatLng(coords.latitude, coords.longitude, coords.altitude ?? undefined),
  );

  const hPositioningErrorEntry = getOrInsertEntry(
    exifDataGpsIfd,
    "H_POSITIONING_ERROR",
  );
  hPositioningErrorEntry.format = "RATIONAL";
  hPositioningErrorEntry.fromTypedArray(
    mapRationalFromObject([
      approximateRational(
        coords.accuracy,
        undefined,
        undefined,
        MAX_UINT32_VALUE,
        MAX_UINT32_VALUE,
      ),
    ]),
  );

  if (coords.speed !== null) {
    const speedEntry = getOrInsertEntry(exifDataGpsIfd, "SPEED");
    speedEntry.format = "RATIONAL";
    speedEntry.fromTypedArray(
      mapRationalFromObject([
        approximateRational(
          coords.speed * (METERS_IN_KILOMETERS / SECONDS_IN_HOUR),
          undefined,
          undefined,
          MAX_UINT32_VALUE,
          MAX_UINT32_VALUE,
        ),
      ]),
    );
    const speedRefEntry = getOrInsertEntry(exifDataGpsIfd, "SPEED_REF");
    speedRefEntry.format = "ASCII";
    speedRefEntry.fromTypedArray(encodeStringToUtf8("K"));
  }

  if (coords.heading !== null) {
    const imgDirectionEntry = getOrInsertEntry(exifDataGpsIfd, "IMG_DIRECTION");
    imgDirectionEntry.format = "RATIONAL";
    imgDirectionEntry.fromTypedArray(
      mapRationalFromObject([
        approximateRational(
          coords.heading,
          undefined,
          undefined,
          MAX_UINT32_VALUE,
          MAX_UINT32_VALUE,
        ),
      ]),
    );
    const imgDirectionRefEntry = getOrInsertEntry(
      exifDataGpsIfd,
      "IMG_DIRECTION_REF",
    );
    imgDirectionRefEntry.format = "ASCII";
    // 0 degrees is true north
    imgDirectionRefEntry.fromTypedArray(encodeStringToUtf8("T"));
  }
};

export { setGpsExifFromGeolocationPosition };
