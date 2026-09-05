import { fromAbsolute, toCalendarDate, toTime } from "@internationalized/date";
import { LatLng } from "leaflet";
import { ExifIfd, mapRationalFromObject, type ExifData } from "libexif-wasm";

import { approximateRational } from "#lib/math/approximateRational";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import { MAX_UINT32_VALUE } from "../constants";
import { formatExifDateStamp } from "../date/dateStamp/formatExifDateStamp";
import { formatExifTimeStamp } from "../date/timeStamp/formatExifTimeStamp";
import { getOrInsertEntry } from "../utils/getOrInsertEntry";
import { updateLatLng } from "./updateLatLng";

const SECONDS_IN_HOUR = 3600;
const METERS_IN_KILOMETERS = 1000;

const updateGeolocationPosition = (
  exifData: ExifData,
  geolocationPosition: GeolocationPosition,
) => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];
  const { timestamp, coords } = geolocationPosition;
  const zonedDateTime = fromAbsolute(timestamp, "UTC");

  const dateStampEntry = getOrInsertEntry(exifDataGpsIfd, "DATE_STAMP");
  dateStampEntry.format = "ASCII";
  dateStampEntry.fromTypedArray(
    encodeStringToUtf8(formatExifDateStamp(toCalendarDate(zonedDateTime))),
  );
  const timeStampEntry = getOrInsertEntry(exifDataGpsIfd, "TIME_STAMP");
  timeStampEntry.format = "RATIONAL";
  timeStampEntry.fromTypedArray(
    new Uint32Array(formatExifTimeStamp(toTime(zonedDateTime))),
  );

  updateLatLng(
    exifData,
    new LatLng(coords.latitude, coords.longitude, coords.altitude ?? undefined),
  );

  const hPositioningErrorEntry = getOrInsertEntry(
    exifDataGpsIfd,
    "H_POSITIONING_ERROR",
  );
  hPositioningErrorEntry.format = "RATIONAL";
  hPositioningErrorEntry.fromTypedArray(
    mapRationalFromObject(
      [approximateRational(coords.accuracy, MAX_UINT32_VALUE)],
      "RATIONAL",
    ),
  );

  if (coords.speed !== null) {
    const speedEntry = getOrInsertEntry(exifDataGpsIfd, "SPEED");
    speedEntry.format = "RATIONAL";
    speedEntry.fromTypedArray(
      mapRationalFromObject(
        [
          approximateRational(
            coords.speed * (METERS_IN_KILOMETERS / SECONDS_IN_HOUR),
            MAX_UINT32_VALUE,
          ),
        ],
        "RATIONAL",
      ),
    );
    const speedRefEntry = getOrInsertEntry(exifDataGpsIfd, "SPEED_REF");
    speedRefEntry.format = "ASCII";
    speedRefEntry.fromTypedArray(encodeStringToUtf8("K"));
  }

  if (coords.heading !== null) {
    const imgDirectionEntry = getOrInsertEntry(exifDataGpsIfd, "IMG_DIRECTION");
    imgDirectionEntry.format = "RATIONAL";
    imgDirectionEntry.fromTypedArray(
      mapRationalFromObject(
        [approximateRational(coords.heading, MAX_UINT32_VALUE)],
        "RATIONAL",
      ),
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

export { updateGeolocationPosition };
