import { CalendarDate } from "@internationalized/date";

const formatExifDateStamp = (calendarDate: CalendarDate) => {
  return (
    calendarDate.year.toString().padStart(4, "0") +
    ":" +
    calendarDate.month.toString().padStart(2, "0") +
    ":" +
    calendarDate.day.toString().padStart(2, "0")
  );
};

export { formatExifDateStamp };
