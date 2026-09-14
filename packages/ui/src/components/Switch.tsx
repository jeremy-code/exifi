import type { ComponentPropsWithRef } from "react";

import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
  type SwitchRenderProps,
} from "react-aria-components/Switch";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

const switchTrackVariants = tv({
  extend: focusRing,
  base: [
    "relative inline-flex justify-start gap-2 rounded-full ring-1 transition-[background-color,box-shadow,opacity] ring-inset",
    "shrink-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "h-(--switch-height) w-(--switch-width)",
    "group-not-selected/switch:bg-bg-muted group-not-selected/switch:ring-border group-hover/switch:group-not-selected/switch:ring-fg-subtle group-pressed/switch:group-not-selected/switch:ring-neutral",
    "group-selected/switch:bg-accent group-selected/switch:ring-accent",
  ],
});

type SwitchTrackProps = {
  renderProps?: SwitchRenderProps;
} & ComponentPropsWithRef<"div"> &
  VariantProps<typeof switchTrackVariants>;

const SwitchTrack = ({
  className,
  renderProps,
  ...props
}: SwitchTrackProps) => (
  <div
    className={switchTrackVariants({ className, ...renderProps })}
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

const switchVariants = tv({
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

type SwitchRootProps = AriaSwitchProps & VariantProps<typeof switchVariants>;

const SwitchRoot = ({ size, ...props }: SwitchRootProps) => (
  <AriaSwitch
    {...props}
    className={composeRenderProps(props.className, (className, renderProps) =>
      switchVariants({ className, size, ...renderProps }),
    )}
  />
);

type SwitchProps = {
  switchTrackProps?: SwitchTrackProps;
  switchHandleProps?: SwitchHandleProps;
} & SwitchRootProps;

const Switch = ({ switchTrackProps, ...props }: SwitchProps) => (
  <SwitchRoot {...props}>
    {composeRenderProps(props.children, (children, renderProps) => (
      <>
        <SwitchTrack renderProps={renderProps} {...switchTrackProps}>
          <SwitchHandle {...switchTrackProps} />
        </SwitchTrack>
        {children}
      </>
    ))}
  </SwitchRoot>
);

export {
  SwitchTrack,
  type SwitchTrackProps,
  switchTrackVariants,
  SwitchHandle,
  type SwitchHandleProps,
  switchHandleVariants,
  SwitchRoot,
  type SwitchRootProps,
  Switch,
  type SwitchProps,
  switchVariants,
};
