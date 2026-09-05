import { CalendarIcon } from "lucide-react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
} from "react-aria-components/DatePicker";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { Calendar } from "./Calendar";
import { DateInput } from "./DateInput";
import { FieldButton } from "./FieldButton";
import { Popover } from "./Popover";
import {
  Description,
  FieldError,
  FieldGroup,
  Label,
  type FieldErrorMessage,
} from "./form";

type DatePickerProps<T extends DateValue> = {
  label?: string;
  description?: string;
  errorMessage?: FieldErrorMessage;
} & AriaDatePickerProps<T>;

const DatePicker = <T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DatePickerProps<T>) => {
  return (
    <AriaDatePicker
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="w-auto min-w-52 cursor-text disabled:cursor-default">
        <DateInput className="h-[unset] min-w-37.5 flex-1 border-none px-3 text-sm outline-none" />
        <FieldButton className="mr-1 w-6 outline-offset-0">
          <CalendarIcon aria-hidden className="size-4" />
        </FieldButton>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="min-w-[unset] p-2">
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
};

export { DatePicker, type DatePickerProps };
