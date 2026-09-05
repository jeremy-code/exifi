import { ExifIfd, type ExifData } from "libexif-wasm";

import { parseExifDateStamp } from "./date/dateStamp/parseExifDateStamp";
import { parseExifTimeStamp } from "./date/timeStamp/parseExifTimeStamp";

const parseGpsDateTimeEntries = (exifData: ExifData) => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];

  const gpsDateValue = exifDataGpsIfd.getEntry("DATE_STAMP");
  const gpsTimeValue = exifDataGpsIfd.getEntry("TIME_STAMP");

  if (gpsDateValue === null || gpsTimeValue === null) {
    return null;
  }

  const gpsDate = parseExifDateStamp(gpsDateValue.toString());
  const gpsTime = parseExifTimeStamp(gpsTimeValue.toTypedArray());

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
