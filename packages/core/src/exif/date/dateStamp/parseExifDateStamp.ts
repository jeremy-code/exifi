import { CalendarDate } from "@internationalized/date";

import { EXIF_DATESTAMP_REGEX } from "../constants";

const parseExifDateStamp = (dateStamp: string) => {
  const match = EXIF_DATESTAMP_REGEX.exec(dateStamp);
  if (
    match === null ||
    match.groups === undefined ||
    match.groups.year === undefined ||
    match.groups.month === undefined ||
    match.groups.day === undefined
  ) {
    throw new Error("Invalid datestamp: " + dateStamp);
  }

  return new CalendarDate(
    Number(match.groups.year),
    Number(match.groups.month),
    Number(match.groups.day),
  );
};

export { parseExifDateStamp };
