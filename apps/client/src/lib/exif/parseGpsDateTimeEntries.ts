import { ExifIfd, mapRationalToObject, type ExifData } from "libexif-wasm";

import { parseDateStamp } from "@exifi/core/exif/date/dateStamp";
import { parseTimeStamp } from "@exifi/core/exif/date/timeStamp";

const parseGpsDateTimeEntries = (exifData: ExifData) => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];

  const gpsDateValue = exifDataGpsIfd.getEntry("DATE_STAMP");
  const gpsTimeValue = exifDataGpsIfd.getEntry("TIME_STAMP");

  if (gpsDateValue === null || gpsTimeValue === null) {
    return null;
  }

  const gpsDate = parseDateStamp(gpsDateValue.toString());
  const gpsTime = parseTimeStamp(
    mapRationalToObject(gpsTimeValue.toTypedArray()),
  );

  return Temporal.ZonedDateTime.from({
    year: gpsDate.year,
    month: gpsDate.month,
    day: gpsDate.day,
    hour: gpsTime.hour,
    minute: gpsTime.minute,
    second: gpsTime.second,
    millisecond: gpsTime.millisecond,
    timeZone: "UTC",
  });
};

export { parseGpsDateTimeEntries };
