import { ExifIfd, mapRationalToObject, type ExifData } from "libexif-wasm";

import { parseDateStamp } from "@exifi/core/exif/date/dateStamp";
import { parseTimeStamp } from "@exifi/core/exif/date/timeStamp";

const parseGpsDateTimeEntries = (
  exifData: ExifData,
): Temporal.ZonedDateTime | null => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];

  const gpsDateValue = exifDataGpsIfd.getEntry("DATE_STAMP");
  const gpsTimeValue = exifDataGpsIfd.getEntry("TIME_STAMP");

  if (gpsDateValue === null || gpsTimeValue === null) {
    return null;
  }

  const { year, month, day } = parseDateStamp(gpsDateValue.toString());
  const { hour, minute, second, millisecond } = parseTimeStamp(
    mapRationalToObject(gpsTimeValue.toTypedArray()),
  );

  return Temporal.ZonedDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timeZone: "UTC",
  });
};

export { parseGpsDateTimeEntries };
