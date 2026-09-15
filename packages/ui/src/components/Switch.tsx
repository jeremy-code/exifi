import type { ComponentPropsWithRef } from "react";

import {
  SwitchField as AriaSwitchField,
  type SwitchFieldProps,
  SwitchButton as AriaSwitchButton,
  type SwitchButtonProps as AriaSwitchButtonProps,
  type SwitchRenderProps,
} from "react-aria-components/Switch";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { focusRing } from "../utils/focusRing";
import { Description, FieldError } from "./form";
import type { FieldErrorMessage } from "./form/FieldError";

const switchTrackVariants = tv({
  extend: focusRing,
  base: [
    "relative inline-flex justify-start gap-2 rounded-full ring-1 transition-[background-color,box-shadow,opacity] ring-inset",
    "shrink-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "h-(--switch-height) w-(--switch-width)",
  ],
  variants: {
    color: {
      accent: [
        "group-not-selected/switch:bg-bg-muted group-not-selected/switch:ring-border group-hover/switch:group-not-selected/switch:ring-fg-subtle group-pressed/switch:group-not-selected/switch:ring-neutral",
        "group-selected/switch:bg-accent group-selected/switch:ring-accent",
      ],
      gray: "bg-bg-muted ring-border group-hover/switch:ring-fg-subtle group-pressed/switch:ring-neutral",
    },
  },
  defaultVariants: {
    color: "accent",
  },
});

type SwitchTrackProps = {
  renderProps?: SwitchRenderProps;
} & ComponentPropsWithRef<"div"> &
  VariantProps<typeof switchTrackVariants>;

const SwitchTrack = ({
  className,
  renderProps,
  color,
  ...props
}: SwitchTrackProps) => (
  <div
    className={switchTrackVariants({ className, color, ...renderProps })}
    {...props}
  />
);

const switchHandleVariants = tv({
  base: [
    "flex items-center justify-center rounded-[inherit] bg-white text-gray-600 shadow-sm transition-[translate]",
    "shrink-0",
    "size-(--switch-height) scale-80",
    "group-selected/switch:translate-x-[calc(var(--switch-width)-var(--switch-height))]",
    "group-data-[size=lg]/switch:text-lg group-data-[size=md]/switch:text-base group-data-[size=sm]/switch:text-sm group-data-[size=xs]/switch:text-xs",
  ],
});

type SwitchHandleProps = ComponentPropsWithRef<"div">;

const SwitchHandle = ({ className, ...props }: SwitchHandleProps) => (
  <div className={switchHandleVariants({ className })} {...props} />
);

const switchButtonVariants = tv({
  base: [
    "group/switch relative flex items-center gap-2 text-sm text-gray-800 transition [-webkit-tap-highlight-color:transparent] dark:text-gray-200",
  ],
  variants: {
    isDisabled: {
      true: "disabled:text-gray-300 dark:disabled:text-gray-600 forced-colors:disabled:text-[GrayText]",
    },

    size: {
      xs: "[--switch-height:--spacing(3)] [--switch-width:--spacing(6)]",
      sm: "[--switch-height:--spacing(4)] [--switch-width:--spacing(8)]",
      md: "[--switch-height:--spacing(5)] [--switch-width:--spacing(10)]",
      lg: "[--switch-height:--spacing(7)] [--switch-width:--spacing(12)]",
    },
  },
  defaultVariants: { size: "md" },
});

type SwitchButtonProps = AriaSwitchButtonProps &
  VariantProps<typeof switchButtonVariants>;

const SwitchButton = ({ size, ...props }: SwitchButtonProps) => (
  <AriaSwitchButton
    {...props}
    className={composeRenderProps(props.className, (className, renderProps) =>
      switchButtonVariants({ className, size, ...renderProps }),
    )}
  />
);

const SwitchField = (props: SwitchFieldProps) => {
  return (
    <AriaSwitchField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    />
  );
};

type SwitchProps = {
  switchButtonProps?: SwitchButtonProps;
  switchTrackProps?: SwitchTrackProps;
  switchHandleProps?: SwitchHandleProps;
  children?: SwitchButtonProps["children"];
  description?: string;
  errorMessage?: FieldErrorMessage;
} & Omit<SwitchFieldProps, "children"> &
  VariantProps<typeof switchButtonVariants>;

const Switch = ({ description, errorMessage, size, ...props }: SwitchProps) => (
  <SwitchField {...props}>
    <SwitchButton size={size} {...props.switchButtonProps}>
      {composeRenderProps(props.children, (children, renderProps) => (
        <>
          <SwitchTrack {...props.switchTrackProps} renderProps={renderProps}>
            <SwitchHandle {...props.switchHandleProps} />
          </SwitchTrack>
          {children}
        </>
      ))}
    </SwitchButton>
    {description && <Description>{description}</Description>}
    <FieldError>{errorMessage}</FieldError>
  </SwitchField>
);

export {
  SwitchTrack,
  type SwitchTrackProps,
  switchTrackVariants,
  SwitchHandle,
  type SwitchHandleProps,
  switchHandleVariants,
  SwitchButton,
  type SwitchButtonProps,
  switchButtonVariants,
  SwitchField,
  type SwitchFieldProps,
  Switch,
  type SwitchProps,
};
