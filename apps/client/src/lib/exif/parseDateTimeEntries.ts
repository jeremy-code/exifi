import { ExifIfd, type ExifData, type Tag } from "libexif-wasm";

import { EXIF_DATETIME_REGEX } from "./date/constants";
import { parseExifDateTime } from "./date/dateTime/parseExifDateTime";

const DATE_TIME_ENTRIES_MAP = {
  DATE_TIME: {
    dateTime: "DATE_TIME",
    offsetTime: "OFFSET_TIME",
    subSecTime: "SUB_SEC_TIME",
  },
  DATE_TIME_ORIGINAL: {
    dateTime: "DATE_TIME_ORIGINAL",
    offsetTime: "OFFSET_TIME_ORIGINAL",
    subSecTime: "SUB_SEC_TIME_ORIGINAL",
  },
  DATE_TIME_DIGITIZED: {
    dateTime: "DATE_TIME_DIGITIZED",
    offsetTime: "OFFSET_TIME_DIGITIZED",
    subSecTime: "SUB_SEC_TIME_DIGITIZED",
  },
} satisfies Partial<
  Record<Tag, { dateTime: Tag; offsetTime: Tag; subSecTime: Tag }>
>;

const parseDateTimeEntries = (
  exifData: ExifData,
  dateTimeKey: keyof typeof DATE_TIME_ENTRIES_MAP,
) => {
  const exifDataExifIfd = exifData.ifd[ExifIfd.EXIF];
  const { dateTime, offsetTime, subSecTime } =
    DATE_TIME_ENTRIES_MAP[dateTimeKey];
  const dateTimeValue = // DATE_TIME may be in IFD0 or IFD1
    (dateTimeKey === "DATE_TIME" ? exifData : exifDataExifIfd)
      .getEntry(dateTime)
      ?.toString();
  const offsetTimeValue = exifDataExifIfd.getEntry(offsetTime)?.toString();
  const subSecTimeValue = exifDataExifIfd.getEntry(subSecTime)?.toString();

  if (dateTimeValue === undefined || !EXIF_DATETIME_REGEX.test(dateTimeValue)) {
    return null;
  }

  const dateTimeDate = parseExifDateTime(dateTimeValue);

  return Temporal.ZonedDateTime.from({
    year: dateTimeDate.year,
    month: dateTimeDate.month,
    day: dateTimeDate.day,
    hour: dateTimeDate.hour,
    minute: dateTimeDate.minute,
    second: dateTimeDate.second,
    millisecond:
      subSecTime !== undefined && !Number.isNaN(Number(subSecTimeValue))
        ? Number(subSecTimeValue)
        : 0,
    timeZone: offsetTimeValue ?? "UTC",
  });
};

export { parseDateTimeEntries };
