import {
  getLocalTimeZone,
  now,
  toCalendarDateTime,
} from "@internationalized/date";
import { ExifIfd, type ExifData } from "libexif-wasm";

import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
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
    encodeStringToUtf8(formatDateTime(toCalendarDateTime(currentDate))),
  );
  const subSecTimeDigitizedEntry = getOrInsertEntry(
    exifDataExifIfd,
    "SUB_SEC_TIME_DIGITIZED",
  );
  subSecTimeDigitizedEntry.format = "ASCII";
  subSecTimeDigitizedEntry.fromTypedArray(
    encodeStringToUtf8(currentDate.millisecond.toString().padStart(3, "0")),
  );
  const offsetTimeDigitizedEntry = getOrInsertEntry(
    exifDataExifIfd,
    "OFFSET_TIME_DIGITIZED",
  );
  offsetTimeDigitizedEntry.format = "ASCII";
  offsetTimeDigitizedEntry.fromTypedArray(encodeStringToUtf8(timezoneOffset));
};

export { updateDateAndTimeDigitized };
