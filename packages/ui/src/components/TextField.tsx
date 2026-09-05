import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components/TextField";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { focusRing } from "../utils/focusRing";
import {
  Description,
  FieldError,
  Input,
  Label,
  fieldBorderVariants,
  inputVariants as rootInputVariants,
  type FieldErrorMessage,
  type InputProps,
} from "./form";

const inputVariants = tv({
  extend: focusRing,
  base: "border transition",
  variants: {
    isFocused: fieldBorderVariants.variants.isFocusWithin,
    isInvalid: fieldBorderVariants.variants.isInvalid,
    isDisabled: fieldBorderVariants.variants.isDisabled,
  },
});

type TextFieldProps = AriaTextFieldProps & {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: FieldErrorMessage;
  inputProps?: InputProps;
} & VariantProps<typeof rootInputVariants>;

const TextField = ({
  className,
  label,
  description,
  errorMessage,
  size,
  ...props
}: TextFieldProps) => {
  return (
    <AriaTextField
      className={composeTailwindRenderProps(className, "flex flex-col gap-1")}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <Input
        size={size}
        {...props.inputProps}
        className={composeRenderProps(
          props.inputProps?.className,
          (className, renderProps) =>
            inputVariants({ ...renderProps, className }),
        )}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
};

export { TextField, type TextFieldProps, inputVariants };
