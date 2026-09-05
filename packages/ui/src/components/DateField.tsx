import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  type DateValue,
} from "react-aria-components/DateField";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { DateInput } from "./DateInput";
import { Description, FieldError, Label, type FieldErrorMessage } from "./form";

type DateFieldProps<T extends DateValue> = {
  label?: string;
  description?: string;
  errorMessage?: FieldErrorMessage;
} & AriaDateFieldProps<T>;

const DateField = <T extends DateValue>({
  className,
  label,
  description,
  errorMessage,
  ...props
}: DateFieldProps<T>) => {
  return (
    <AriaDateField
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-col gap-1")}
    >
      {label && <Label>{label}</Label>}
      <DateInput />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
};

export { DateField, type DateFieldProps };
