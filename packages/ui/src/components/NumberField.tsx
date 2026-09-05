import { ChevronDown, ChevronUp } from "lucide-react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Button,
  type ButtonProps as StepperButtonProps,
} from "react-aria-components/NumberField";
import { cn, type VariantProps } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import {
  FieldError,
  FieldGroup,
  Label,
  Input,
  Description,
  fieldBorderVariants,
  type FieldErrorMessage,
  type inputVariants,
} from "./form";

const StepperButton = ({ className, ...props }: StepperButtonProps) => {
  return (
    <Button
      className={cn(
        "flex flex-1 border-0 bg-transparent px-0.5 py-0 text-fg-subtle transition-[background-color,color] [-webkit-tap-highlight-color:transparent] group-disabled:text-border pressed:bg-bg-muted",
        className,
      )}
      {...props}
    />
  );
};

type NumberFieldProps = {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: FieldErrorMessage;
} & Omit<AriaNumberFieldProps, "children"> &
  VariantProps<typeof inputVariants>;

const NumberField = ({
  className,
  label,
  placeholder,
  description,
  errorMessage,
  size,
  ...props
}: NumberFieldProps) => {
  return (
    <AriaNumberField
      className={composeTailwindRenderProps(className, "flex flex-col gap-1")}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        {(renderProps) => (
          <>
            <Input className="grow" placeholder={placeholder} size={size} />
            <div
              className={fieldBorderVariants({
                ...renderProps,
                className: "flex h-full flex-col border-s",
              })}
            >
              <StepperButton slot="increment">
                <ChevronUp aria-hidden className="size-4" />
              </StepperButton>
              <div
                aria-hidden
                className={fieldBorderVariants({
                  ...renderProps,
                  className: "border-b",
                })}
              />
              <StepperButton slot="decrement">
                <ChevronDown aria-hidden className="size-4" />
              </StepperButton>
            </div>
          </>
        )}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
};

export {
  StepperButton,
  type StepperButtonProps,
  NumberField,
  type NumberFieldProps,
};
