import { fromAbsolute, toCalendarDate, toTime } from "@internationalized/date";
import { ExifIfd, mapRationalFromObject, type ExifData } from "libexif-wasm";

import { MAX_UINT32_VALUE } from "@exifi/core/exif/constants";
import { formatDateStamp } from "@exifi/core/exif/date/dateStamp";
import { formatTimeStamp } from "@exifi/core/exif/date/timeStamp";

import { updateLatLng } from "./updateLatLng";
import { approximateRational } from "../../math/approximateRational";
import { getOrInsertEntry } from "../utils/getOrInsertEntry";

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
    new TextEncoder().encode(
      formatDateStamp(toCalendarDate(zonedDateTime)) + "\u0000",
    ),
  );
  const timeStampEntry = getOrInsertEntry(exifDataGpsIfd, "TIME_STAMP");
  timeStampEntry.format = "RATIONAL";
  timeStampEntry.fromTypedArray(
    new Uint32Array(formatTimeStamp(toTime(zonedDateTime))),
  );

  updateLatLng(exifData, {
    lat: coords.latitude,
    lng: coords.longitude,
    alt: coords.altitude ?? undefined,
  });

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
    speedRefEntry.fromTypedArray(new TextEncoder().encode("K\u0000"));
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
    imgDirectionRefEntry.fromTypedArray(new TextEncoder().encode("T\u0000"));
  }
};

export { updateGeolocationPosition };
