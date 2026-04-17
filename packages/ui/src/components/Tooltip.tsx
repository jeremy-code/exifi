import type { ComponentPropsWithRef } from "react";

import { Slot, Tooltip as TooltipPrimitive } from "radix-ui";
import { tv, type VariantProps } from "tailwind-variants";

const {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
} = TooltipPrimitive;

const tooltipContentVariants = tv({
  slots: {
    base: [
      "z-[calc(infinity)] max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-sm px-2.5 py-1 text-xs/4 font-medium shadow-md",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95",
      "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    ],
    arrow: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs",
  },
  variants: {
    color: {
      foreground: {
        base: "bg-foreground text-background",
        arrow: "bg-foreground fill-foreground",
      },
      surface: {
        base: "bg-surface text-foreground",
        arrow: "bg-surface fill-surface",
      },
    },
  },
  defaultVariants: {
    color: "foreground",
  },
});

type TooltipContentProps = {
  portalProps?: ComponentPropsWithRef<typeof TooltipPrimitive.Content>;
} & ComponentPropsWithRef<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>;

const TooltipContent = ({
  color,
  className,
  children,
  portalProps,
  ...props
}: TooltipContentProps) => {
  const { base, arrow } = tooltipContentVariants({ color });

  return (
    <TooltipPrimitive.Portal {...portalProps}>
      <TooltipPrimitive.Content
        className={base({ className, color })}
        {...props}
      >
        <Slot.Slottable>{children}</Slot.Slottable>
        <TooltipPrimitive.Arrow className={arrow({ color })} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
