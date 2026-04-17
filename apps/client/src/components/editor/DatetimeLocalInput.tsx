import { useMemo } from "react";

import type { Dayjs } from "dayjs";

import { dayjs } from "#utils/date";
import { Input, type InputProps } from "@exiftools/ui/components/Input";

// https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#local_date_and_time_strings
const formatDayjsAsDatetimeLocal = (dayjs: Dayjs) => {
  if (dayjs.second() !== 0 && dayjs.millisecond() !== 0) {
    return dayjs.format("YYYY-MM-DDTHH:mm:ss.SSS");
  } else if (dayjs.second() !== 0 && dayjs.millisecond() === 0) {
    return dayjs.format("YYYY-MM-DDTHH:mm:ss");
  }
  return dayjs.format("YYYY-MM-DDTHH:mm");
};

type DatetimeLocalInputProps = {
  value?: Dayjs;
  onValueChange?: (datetimeLocal: Dayjs) => void;
} & Omit<InputProps, "value">;

const DatetimeLocalInput = ({
  value,
  onValueChange,
  ...props
}: DatetimeLocalInputProps) => {
  const memoizedValue = useMemo(
    () => (value !== undefined ? formatDayjsAsDatetimeLocal(value) : undefined),
    [value],
  );

  return (
    <Input
      {...props}
      type="datetime-local"
      value={memoizedValue}
      onChange={(e) => {
        if (e.target.value !== "") {
          const dateTimeLocal = dayjs(e.target.value);

          if (!dateTimeLocal.isValid()) {
            throw new Error(
              "An error occurred in DatetimeLocalInput, expected a valid date time.",
            );
          }
          onValueChange?.(dateTimeLocal);
        }
      }}
    />
  );
};
export { DatetimeLocalInput };
