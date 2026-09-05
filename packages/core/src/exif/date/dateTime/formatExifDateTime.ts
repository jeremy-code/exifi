import { type CalendarDateTime } from "@internationalized/date";

const formatExifDateTime = (calendarDateTime: CalendarDateTime) => {
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

export { formatExifDateTime };
