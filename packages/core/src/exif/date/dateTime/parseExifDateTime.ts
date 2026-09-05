import { CalendarDateTime } from "@internationalized/date";

import { EXIF_DATETIME_REGEX } from "../constants";

const parseExifDateTime = (dateStamp: string) => {
  const match = EXIF_DATETIME_REGEX.exec(dateStamp);
  if (
    match === null ||
    match.groups === undefined ||
    match.groups.year === undefined ||
    match.groups.month === undefined ||
    match.groups.day === undefined ||
    match.groups.hour === undefined ||
    match.groups.minute === undefined ||
    match.groups.second === undefined
  ) {
    throw new Error("Invalid datetime: " + dateStamp);
  }

  return new CalendarDateTime(
    Number(match.groups.year),
    Number(match.groups.month),
    Number(match.groups.day),
    Number(match.groups.hour),
    Number(match.groups.minute),
    Number(match.groups.second),
  );
};

export { parseExifDateTime };
