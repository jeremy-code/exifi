import type { ComponentPropsWithRef } from "react";

import { Check, Minus } from "lucide-react";
import {
  CheckboxButton as AriaCheckboxButton,
  type CheckboxButtonProps as AriaCheckboxButtonProps,
  CheckboxField as AriaCheckboxField,
  type CheckboxFieldProps,
} from "react-aria-components/Checkbox";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { focusRing } from "../utils/focusRing";
import { Description, FieldError, type FieldErrorMessage } from "./form";

const checkboxButtonVariants = tv({
  base: [
    "group/checkbox flex items-center transition-[color] [-webkit-tap-highlight-color:transparent]",
  ],
  variants: {
    isDisabled: {
      false: "text-fg-bolder",
      true: "cursor-not-allowed text-border forced-colors:text-[GrayText]",
    },
    size: {
      xs: "gap-1.5 text-xs",
      sm: "gap-2 text-sm",
      md: "gap-2.5 text-sm",
      lg: "gap-3 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const boxVariants = tv({
  extend: focusRing,
  base: [
    "flex shrink-0 items-center justify-center rounded-sm border border-transparent text-white transition-[border-color,background-color,color]",
  ],
  variants: {
    isSelected: {
      false: [
        "border-(--color) bg-(--color-surface)",
        "[--color:var(--color-border)] group-hover/checkbox:[--color:var(--color-fg-subtle)] group-pressed/checkbox:[--color:var(--color-fg-muted)]",
      ],
      true: [
        "border-(--color) bg-(--color) text-accent-fg",
        "[--color:var(--color-accent)] group-hover/checkbox:[--color:var(--color-accent-hover)] group-pressed/checkbox:[--color:var(--color-accent-pressed)]",
        "forced-colors:[--color:Highlight]!",
      ],
    },
    isInvalid: {
      true: "[--color:var(--color-red-700)] group-pressed/checkbox:[--color:var(--color-red-800)] dark:[--color:var(--color-red-600)] dark:group-pressed/checkbox:[--color:var(--color-red-700)] forced-colors:[--color:Mark]!",
    },
    isDisabled: {
      true: "[--color:var(--color-bg-muted)] forced-colors:[--color:GrayText]!",
    },
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5 p-0.5",
      lg: "size-6 p-0.5",
    },
  },
  defaultVariants: checkboxButtonVariants.defaultVariants,
});

const iconVariants = tv({
  base: [
    "pointer-events-none size-4 text-accent-fg",
    "group-invalid/checkbox:text-red-50",
    "group-disabled/checkbox:text-border",
    "forced-colors:text-[HighlightText]",
  ],
});

type CheckboxButtonProps = {
  boxProps?: ComponentPropsWithRef<"div">;
} & AriaCheckboxButtonProps &
  VariantProps<typeof checkboxButtonVariants>;

const CheckboxButton = ({ size, ...props }: CheckboxButtonProps) => {
  return (
    <AriaCheckboxButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        checkboxButtonVariants({ ...renderProps, className, size }),
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { isSelected, isIndeterminate, ...renderProps }) => (
          <>
            <div
              {...props.boxProps}
              {...(isSelected || isIndeterminate
                ? { "data-selected": "true" }
                : {})}
              className={boxVariants({
                ...renderProps,
                isSelected: isSelected || isIndeterminate,
                size,
                className: props.boxProps?.className,
              })}
            >
              {isIndeterminate ? (
                <Minus aria-hidden className={iconVariants()} />
              ) : isSelected ? (
                <Check aria-hidden className={iconVariants()} />
              ) : null}
            </div>
            {children}
          </>
        ),
      )}
    </AriaCheckboxButton>
  );
};

const CheckboxField = (props: CheckboxFieldProps) => {
  return (
    <AriaCheckboxField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1",
      )}
    />
  );
};

type CheckboxProps = {
  checkboxButtonProps: CheckboxButtonProps;
  children?: CheckboxButtonProps["children"];
  description?: string;
  errorMessage?: FieldErrorMessage;
} & CheckboxFieldProps;

const Checkbox = ({
  checkboxButtonProps,
  errorMessage,
  description,
  children,
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxField {...props}>
      <CheckboxButton {...checkboxButtonProps}>{children}</CheckboxButton>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </CheckboxField>
  );
};

export {
  boxVariants,
  iconVariants,
  CheckboxButton,
  type CheckboxButtonProps,
  checkboxButtonVariants,
  CheckboxField,
  type CheckboxFieldProps,
  Checkbox,
  type CheckboxProps,
};
