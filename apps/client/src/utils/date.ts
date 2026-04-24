import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

// https://github.com/iamkun/dayjs/issues/2760
if (import.meta.env.DEV) {
  void import("dayjs/plugin/devHelper").then((dayjsDevHelper) =>
    dayjs.extend(dayjsDevHelper.default),
  );
}

export { dayjs };
