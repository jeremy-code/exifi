import {
  getLocalTimeZone,
  now,
  toCalendarDateTime,
} from "@internationalized/date";
import { ExifIfd, type ExifData } from "libexif-wasm";

import { formatDateTime } from "@exifi/core/exif/date/dateTime";

import { getOrInsertEntry } from "../utils/getOrInsertEntry";

const updateDateAndTimeDigitized = (exifData: ExifData) => {
  const exifDataExifIfd = exifData.ifd[ExifIfd.EXIF];

  const currentDate = now(getLocalTimeZone());
  const timezoneOffset = Temporal.Now.zonedDateTimeISO().offset;

  const dateTimeDigitizedEntry = getOrInsertEntry(
    exifDataExifIfd,
    "DATE_TIME_DIGITIZED",
  );
  dateTimeDigitizedEntry.format = "ASCII";
  dateTimeDigitizedEntry.fromTypedArray(
    new TextEncoder().encode(
      formatDateTime(toCalendarDateTime(currentDate)) + "\u0000",
    ),
  );
  const subSecTimeDigitizedEntry = getOrInsertEntry(
    exifDataExifIfd,
    "SUB_SEC_TIME_DIGITIZED",
  );
  subSecTimeDigitizedEntry.format = "ASCII";
  subSecTimeDigitizedEntry.fromTypedArray(
    new TextEncoder().encode(
      currentDate.millisecond.toString().padStart(3, "0") + "\u0000",
    ),
  );
  const offsetTimeDigitizedEntry = getOrInsertEntry(
    exifDataExifIfd,
    "OFFSET_TIME_DIGITIZED",
  );
  offsetTimeDigitizedEntry.format = "ASCII";
  offsetTimeDigitizedEntry.fromTypedArray(
    new TextEncoder().encode(timezoneOffset + "\u0000"),
  );
};

export { updateDateAndTimeDigitized };
