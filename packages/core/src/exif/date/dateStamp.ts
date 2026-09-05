import { CalendarDate } from "@internationalized/date";

import { EXIF_DATESTAMP_REGEX } from "./constants";

const formatDateStamp = (calendarDate: CalendarDate) => {
  return (
    calendarDate.year.toString().padStart(4, "0") +
    ":" +
    calendarDate.month.toString().padStart(2, "0") +
    ":" +
    calendarDate.day.toString().padStart(2, "0")
  );
};

const parseDateStamp = (dateStamp: string) => {
  const match = EXIF_DATESTAMP_REGEX.exec(dateStamp);
  if (
    match === null ||
    match.groups?.year === undefined ||
    match.groups?.month === undefined ||
    match.groups?.day === undefined
  ) {
    throw new Error("Invalid datestamp: " + dateStamp);
  }

  return new CalendarDate(
    Number(match.groups.year),
    Number(match.groups.month),
    Number(match.groups.day),
  );
};

export { parseDateStamp, formatDateStamp };
