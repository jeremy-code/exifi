import { createContext, use, type ComponentPropsWithRef } from "react";

import { Tabs as TabsPrimitive } from "radix-ui";
import { cn, tv, type VariantProps } from "tailwind-variants";

const tabsVariants = tv({
  base: [
    "group/tabs relative",
    "data-[orientation=horizontal]:block data-[orientation=vertical]:flex",
  ],
  variants: {
    size: {
      sm: "[--tabs-content-padding:--spacing(3)] [--tabs-height:--spacing(9)]",
      md: "[--tabs-content-padding:--spacing(4)] [--tabs-height:--spacing(10)]",
      lg: "[--tabs-content-padding:--spacing(4.5)] [--tabs-height:--spacing(11)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type TabsProps = ComponentPropsWithRef<typeof TabsPrimitive.Root> &
  VariantProps<typeof tabsVariants>;

const Tabs = ({ size = "md", className, ...props }: TabsProps) => {
  return (
    <TabsPrimitive.Root
      data-size={size}
      className={tabsVariants({ size, className })}
      {...props}
    />
  );
};

const tabsListVariants = tv({
  slots: {
    base: [
      "relative isolate inline-flex min-h-(--tabs-height)",
      "data-[orientation=horizontal]:flex-row",
      "data-[orientation=vertical]:flex-col",
    ],
    trigger: [
      "outline-0",
      "relative flex h-(--tabs-height) min-w-(--tabs-height) cursor-[button] items-center gap-2 font-medium",
      "focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-[colorPalette.focusRing]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[--tabs-trigger-radius:--spacing(1)]",
      "group-data-[size=sm]/tabs:px-3 group-data-[size=sm]/tabs:py-1 group-data-[size=sm]/tabs:text-sm/5",
      "group-data-[size=md]/tabs:px-4 group-data-[size=md]/tabs:py-2 group-data-[size=md]/tabs:text-sm/5",
      "group-data-[size=lg]/tabs:px-4.5 group-data-[size=lg]/tabs:py-2 group-data-[size=lg]/tabs:text-base/6",
    ],
  },
  variants: {
    variant: {
      line: {
        base: "flex data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-r",
        trigger: [
          "disabled:data-state=[active]:bg-[initial] text-muted-foreground data-[state=active]:text-foreground",
          "data-[state=active]:after:absolute",
          "data-[orientation=horizontal]:data-[state=active]:after:inset-x-0 data-[orientation=horizontal]:data-[state=active]:after:-bottom-px data-[orientation=horizontal]:data-[state=active]:after:h-0.5 data-[orientation=horizontal]:data-[state=active]:after:bg-foreground",
          "data-[orientation=vertical]:data-[state=active]:after:inset-y-0 data-[orientation=vertical]:data-[state=active]:after:-right-px data-[orientation=vertical]:data-[state=active]:after:w-0.5 data-[orientation=vertical]:data-[state=active]:after:bg-foreground",
        ],
      },
      subtle: {
        base: null,
        trigger:
          "rounded-(--tabs-trigger-radius) text-muted-foreground data-[state=active]:bg-subtle data-[state=active]:text-foreground",
      },
      muted: {
        base: null,
        trigger:
          "rounded-(--tabs-trigger-radius) text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground",
      },
      enclosed: {
        base: "min-h-[calc(var(--tabs-height)---spacing(1))] rounded-md bg-muted p-1",
        trigger:
          "justify-center rounded-(--tabs-trigger-radius) text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs",
      },
      outline: {
        base: [
          "[--line-offset:calc(var(--line-thickness)*-1)] [--line-thickness:1px]",
          "flex border-border",
          "data-[orientation=horizontal]:before:absolute data-[orientation=horizontal]:before:bottom-0 data-[orientation=horizontal]:before:w-full data-[orientation=horizontal]:before:[border-bottom-width:var(--line-thickness)] data-[orientation=horizontal]:before:border-b-border",
          "data-[orientation=vertical]:before:absolute data-[orientation=vertical]:before:inset-x-(--line-offset) data-[orientation=vertical]:before:h-[calc(100%-calc(var(--line-thickness)*2))] data-[orientation=vertical]:before:[border-right-width:var(--line-thickness)] data-[orientation=vertical]:before:border-r-border",
        ],
        trigger: [
          "border border-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground",
          "data-[orientation=horizontal]:border-t-rounded-(--tabs-trigger-radius) data-[orientation=horizontal]:mb-(--line-offset) data-[orientation=horizontal]:not-last:mr-(--line-offset) data-[orientation=horizontal]:data-[state=active]:border-border data-[orientation=horizontal]:data-[state=active]:border-b-transparent",
          "data-[orientation=vertical]:border-l-rounded-(--tabs-trigger-radius) data-[orientation=vertical]:mr-(--line-offset) data-[orientation=vertical]:not-last:mb-(--line-offset) data-[orientation=vertical]:data-[state=active]:border-border data-[orientation=vertical]:data-[state=active]:border-r-transparent",
        ],
      },
      plain: {
        base: null,
        trigger:
          "rounded-(--tabs-trigger-radius) text-muted-foreground data-[state=active]:text-foreground",
      },
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

const TabsListContext = createContext<VariantProps<
  typeof tabsListVariants
> | null>(null);

type TabsListProps = ComponentPropsWithRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>;

const TabsList = ({ className, variant, ...props }: TabsListProps) => {
  const { base } = tabsListVariants({ variant });
  return (
    <TabsListContext value={{ variant }}>
      <TabsPrimitive.List className={base({ className, variant })} {...props} />
    </TabsListContext>
  );
};

const TabsTrigger = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) => {
  const tabsListContext = use(TabsListContext);
  if (!tabsListContext) {
    throw new Error("TabsTrigger must be used within a TabsList");
  }
  const { trigger } = tabsListVariants(tabsListContext);

  return (
    <TabsPrimitive.Trigger
      className={trigger({ className, ...tabsListContext })}
      {...props}
    />
  );
};

const TabsContent = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      className={cn(
        "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:pt-(--tabs-content-padding)",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:pl-(--tabs-content-padding)",
        className,
      )}
      {...props}
    />
  );
};

export {
  Tabs,
  type TabsProps,
  tabsVariants,
  TabsList,
  type TabsListProps,
  tabsListVariants,
  TabsTrigger,
  TabsContent,
};
