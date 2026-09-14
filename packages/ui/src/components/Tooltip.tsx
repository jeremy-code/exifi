import type { ComponentPropsWithRef } from "react";

import {
  TooltipTrigger,
  type TooltipTriggerComponentProps as TooltipTriggerProps,
  Tooltip as AriaTooltip,
  type TooltipProps,
  Focusable as TooltipTarget,
} from "react-aria-components/Tooltip";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

import { OverlayArrow } from "./OverlayArrow";

const tooltipVariants = tv({
  base: [
    "max-w-xs origin-(--trigger-anchor-point) rounded-sm border border-border bg-surface px-2.5 py-1 text-xs/4 font-medium",
  ],
  variants: {
    isEntering: {
      true: "animate-in fade-in-0 zoom-in-95",
    },
    isExiting: {
      true: "animate-out fade-out-0 zoom-out-95",
    },
    placement: {
      left: "slide-in-from-right-2",
      right: "slide-in-from-left-2",
      top: "slide-in-from-bottom-2",
      bottom: "slide-in-from-top-2",
      center: null,
    },
  },
});

const Tooltip = ({ offset = 10, ...props }: TooltipProps) => {
  return (
    <AriaTooltip
      {...props}
      offset={offset}
      className={composeRenderProps(
        props.className,
        (className, { placement, ...renderProps }) =>
          tooltipVariants({
            ...renderProps,
            placement: placement ?? undefined,
            className,
          }),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <OverlayArrow className="size-2" />
          {children}
        </>
      ))}
    </AriaTooltip>
  );
};

type TooltipTargetProps = ComponentPropsWithRef<typeof TooltipTarget>;

export {
  TooltipTrigger,
  type TooltipTriggerProps,
  Tooltip,
  type TooltipProps,
  tooltipVariants,
  TooltipTarget,
  type TooltipTargetProps,
};
