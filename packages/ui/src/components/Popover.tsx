import {
  DialogTrigger as PopoverTrigger,
  type DialogTriggerProps as PopoverTriggerProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components/Popover";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { OverlayArrow } from "./OverlayArrow";

const popoverVariants = tv({
  base: [
    "min-w-(--trigger-width) origin-(--trigger-anchor-point)",
    "rounded-md border border-border bg-surface text-fg shadow-md outline-none",
  ],
  variants: {
    placement: {
      left: "slide-in-from-right-2",
      right: "slide-in-from-left-2",
      top: "slide-in-from-bottom-2",
      bottom: "slide-in-from-top-2",
      center: null,
    },
    isEntering: {
      true: "animate-in ease-out fade-in-0 zoom-in-95",
    },
    isExiting: {
      true: "animate-out ease-in fade-out-0 zoom-out-95",
    },
    size: {
      sm: "max-h-56",
      md: "max-h-64",
      lg: "max-h-80",
    },
  },
});

type PopoverProps = AriaPopoverProps & {
  showArrow?: boolean;
} & VariantProps<typeof popoverVariants>;

const Popover = ({ showArrow, offset, size, ...props }: PopoverProps) => {
  const defaultOffset = showArrow ? 12 : 8;

  return (
    <AriaPopover
      offset={offset ?? defaultOffset}
      {...props}
      className={composeRenderProps(
        props.className,
        (className, { placement, ...renderProps }) =>
          popoverVariants({
            ...renderProps,
            placement: placement ?? undefined,
            size,
            className,
          }),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {showArrow && <OverlayArrow />}
          {children}
        </>
      ))}
    </AriaPopover>
  );
};

export {
  Popover,
  type PopoverProps,
  popoverVariants,
  PopoverTrigger,
  type PopoverTriggerProps,
};
