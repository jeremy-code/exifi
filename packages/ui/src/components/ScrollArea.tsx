import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

const scrollAreaViewportVariants = tv({
  base: [
    "size-full rounded-[inherit]",
    focusRing.base,
    "-outline-offset-2 focus-visible:outline-2",
  ],
  variants: {
    maskImage: {
      x: "scroll-fade-mask-x",
      y: "scroll-fade-mask-y",
    },
  },
});

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props &
  VariantProps<typeof scrollAreaViewportVariants>;

const ScrollArea = ({ children, maskImage, ...props }: ScrollAreaProps) => {
  return (
    <ScrollAreaPrimitive.Root {...props}>
      <ScrollAreaPrimitive.Viewport
        className={scrollAreaViewportVariants({ maskImage })}
      >
        <ScrollAreaPrimitive.Content>{children}</ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};

const ScrollBar = ({
  className,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) => {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        "flex touch-none bg-bg-muted/50 p-0.5 opacity-0 transition-opacity select-none",
        "data-hovering:pointer-events-auto data-hovering:opacity-100",
        "data-scrolling:pointer-events-auto data-scrolling:opacity-100",
        "orientation-vertical:w-2.5 orientation-vertical:flex-row",
        "orientation-horizontal:h-2.5 orientation-horizontal:flex-col",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-[--spacing(2.5)] bg-fg-subtle" />
    </ScrollAreaPrimitive.Scrollbar>
  );
};

export { ScrollArea, ScrollBar };
