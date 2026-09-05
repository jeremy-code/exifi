import { CalendarDateTime } from "@internationalized/date";

import { EXIF_DATETIME_REGEX } from "./constants";

const formatDateTime = (calendarDateTime: CalendarDateTime) => {
  return (
    calendarDateTime.year.toString().padStart(4, "0") +
    ":" +
    calendarDateTime.month.toString().padStart(2, "0") +
    ":" +
    calendarDateTime.day.toString().padStart(2, "0") +
    " " +
    calendarDateTime.hour.toString().padStart(2, "0") +
    ":" +
    calendarDateTime.minute.toString().padStart(2, "0") +
    ":" +
    calendarDateTime.second.toString().padStart(2, "0")
  );
};

const parseDateTime = (dateStamp: string) => {
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

export { parseDateTime, formatDateTime };
