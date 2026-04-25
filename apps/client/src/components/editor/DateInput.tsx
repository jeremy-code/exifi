import { Dayjs } from "dayjs";

import { dayjs } from "#utils/date";
import { Input, type InputProps } from "@exifi/ui/components/Input";

type DateInputProps = {
  value: Dayjs;
  onValueChange: (date: Dayjs) => void;
} & Omit<InputProps, "value">;

const DateInput = ({ value, onValueChange, ...props }: DateInputProps) => {
  return (
    <Input
      {...props}
      type="date"
      value={value.format("YYYY-MM-DD")}
      onChange={(event) => {
        if (event.target.value !== "" && event.target.valueAsDate !== null) {
          onValueChange?.(dayjs(event.target.valueAsDate));
        }
      }}
    />
  );
};

export { DateInput };
