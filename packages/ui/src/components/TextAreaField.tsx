import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components/TextField";
import { tv } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { focusRing } from "../utils/focusRing";
import {
  Description,
  FieldError,
  Label,
  TextArea,
  fieldBorderVariants,
  type FieldErrorMessage,
} from "./form";

const textAreaVariants = tv({
  extend: focusRing,
  variants: {
    isFocused: fieldBorderVariants.variants.isFocusWithin,
    isInvalid: fieldBorderVariants.variants.isInvalid,
    isDisabled: fieldBorderVariants.variants.isDisabled,
  },
});

type TextAreaFieldProps = AriaTextFieldProps & {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: FieldErrorMessage;
};

const TextAreaField = ({
  className,
  label,
  description,
  errorMessage,
  ...props
}: TextAreaFieldProps) => {
  return (
    <AriaTextField
      className={composeTailwindRenderProps(className, "flex flex-col gap-1")}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <TextArea className={textAreaVariants} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
};

export { TextAreaField, type TextAreaFieldProps, textAreaVariants };
