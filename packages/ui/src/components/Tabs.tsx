import { createContext, use, type ComponentPropsWithRef } from "react";

import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanels as AriaTabPanels,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  SelectionIndicator as AriaSelectionIndicator,
  type TabListProps,
  type TabPanelProps,
  type TabPanelsProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components/Tabs";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

const tabsVariants = tv({
  base: ["group/tabs relative flex"],
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row",
    },
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

const Tabs = ({
  size = "md",
  ...props
}: TabsProps & VariantProps<typeof tabsVariants>) => {
  return (
    <AriaTabs
      {...props}
      data-size={size}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabsVariants({ ...renderProps, size, className }),
      )}
    />
  );
};

const tabListVariants = tv({
  slots: {
    base: [
      "relative isolate inline-flex min-h-(--tabs-height)",
      "orientation-horizontal:flex-row",
      "orientation-vertical:flex-col",
    ],
    tab: [
      "relative flex h-(--tabs-height) min-w-(--tabs-height) cursor-default items-center gap-2 font-medium outline-0 forced-color-adjust-none [-webkit-tap-highlight-color:transparent]",
      "focus-visible:z-1",
      "[--tabs-tab-radius:--spacing(1)]",
      "group-data-[size=sm]/tabs:px-3 group-data-[size=sm]/tabs:py-1 group-data-[size=sm]/tabs:text-sm/5",
      "group-data-[size=md]/tabs:px-4 group-data-[size=md]/tabs:py-2 group-data-[size=md]/tabs:text-sm/5",
      "group-data-[size=lg]/tabs:px-4.5 group-data-[size=lg]/tabs:py-2 group-data-[size=lg]/tabs:text-base/6",
      focusRing.base,
    ],
    selectionIndicator: [
      "absolute top-0 left-0 size-full",
      "-z-1 group-disabled/tabs:bg-fg-subtle group-disabled/tabs:mix-blend-normal",
      "motion-safe:transition-[translate,width,height]",
    ],
  },
  variants: {
    fitted: {
      true: {
        base: "flex",
        tab: "flex-1 justify-center text-center",
      },
    },
    justify: {
      start: { base: "justify-start" },
      center: { base: "justify-center" },
      end: { base: "justify-end" },
    },
    variant: {
      line: {
        base: "flex border-border orientation-horizontal:border-b orientation-vertical:border-r",
        tab: [
          "text-fg-muted selected:text-fg disabled:selected:bg-[initial]",
          "selected:after:absolute selected:after:bg-fg",
          "group-orientation-horizontal/tabs:selected:after:inset-x-0 group-orientation-horizontal/tabs:selected:after:-bottom-px group-orientation-horizontal/tabs:selected:after:h-0.5",
          "group-orientation-vertical/tabs:selected:after:inset-y-0 group-orientation-vertical/tabs:selected:after:-right-px group-orientation-vertical/tabs:selected:after:w-0.5",
        ],
      },
      subtle: {
        base: null,
        tab: "rounded-(--tabs-tab-radius) text-fg-muted selected:text-fg",
        selectionIndicator: "rounded-(--tabs-tab-radius) bg-bg-subtle",
      },
      muted: {
        base: null,
        tab: "rounded-(--tabs-tab-radius) text-fg-muted selected:text-fg",
        selectionIndicator: "rounded-(--tabs-tab-radius) bg-bg-muted",
      },
      enclosed: {
        base: "min-h-[calc(var(--tabs-height)-(--spacing(1)))] rounded-md bg-bg-muted p-1",
        tab: [
          "justify-center rounded-(--tabs-tab-radius) text-fg-muted selected:text-fg",
        ],
        selectionIndicator:
          "rounded-(--tabs-tab-radius) bg-white shadow-xs dark:bg-gray-700",
      },
      outline: {
        base: [
          "[--line-offset:calc(var(--line-thickness)*-1)] [--line-thickness:1px]",
          "flex border-border",
          "orientation-horizontal:before:absolute orientation-horizontal:before:bottom-0 orientation-horizontal:before:w-full orientation-horizontal:before:[border-bottom-width:var(--line-thickness)] orientation-horizontal:before:border-b-border",
          "orientation-vertical:before:absolute orientation-vertical:before:inset-x-(--line-offset) orientation-vertical:before:h-[calc(100%-calc(var(--line-thickness)*2))] orientation-vertical:before:[border-right-width:var(--line-thickness)] orientation-vertical:before:border-r-border",
        ],
        tab: [
          "border border-transparent text-fg-muted selected:bg-bg selected:text-fg",
          "group-orientation-horizontal/tabs:mb-(--line-offset) group-orientation-horizontal/tabs:rounded-t-(--tabs-tab-radius) group-orientation-horizontal/tabs:not-last:mr-(--line-offset) group-orientation-horizontal/tabs:selected:border-border group-orientation-horizontal/tabs:selected:border-b-transparent",
          "group-orientation-vertical/tabs:mr-(--line-offset) group-orientation-vertical/tabs:rounded-l-(--tabs-tab-radius) group-orientation-vertical/tabs:not-last:mb-(--line-offset) group-orientation-vertical/tabs:selected:border-border group-orientation-vertical/tabs:selected:border-r-transparent",
        ],
        selectionIndicator: "hidden",
      },
      plain: {
        base: null,
        tab: "rounded-(--tabs-tab-radius) text-fg-muted selected:text-fg",
        selectionIndicator: "hidden",
      },
    },
    isDisabled: {
      true: {
        tab: "cursor-not-allowed text-fg-subtle forced-colors:text-[GrayText] selected:text-fg-subtle forced-colors:selected:text-[HighlightText]",
      },
    },
    isFocusVisible: {
      true: {
        tab: focusRing.variants.isFocusVisible.true,
      },
      false: {
        tab: focusRing.variants.isFocusVisible.false,
      },
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

const TabListContext = createContext<ReturnType<typeof tabListVariants> | null>(
  null,
);

const useTabListContext = () => {
  const context = use(TabListContext);
  if (!context) {
    throw new Error("useTabListContext must be used within a TabListProvider");
  }
  return context;
};

const TabList = <T extends object>({
  variant,
  justify,
  fitted,
  ...props
}: TabListProps<T> &
  VariantProps<typeof tabListVariants> &
  Pick<ComponentPropsWithRef<typeof AriaTabList>, "ref">) => {
  const computedTabListVariants = tabListVariants({
    variant,
    justify,
    fitted,
  });

  return (
    <TabListContext value={computedTabListVariants}>
      <AriaTabList
        {...props}
        className={composeRenderProps(
          props.className,
          (className, renderProps) =>
            computedTabListVariants.base({ ...renderProps, className }),
        )}
      />
    </TabListContext>
  );
};

const Tab = (props: TabProps & ComponentPropsWithRef<typeof AriaTab>) => {
  const { tab, selectionIndicator } = useTabListContext();

  return (
    <AriaTab
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tab({ ...renderProps, className }),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <AriaSelectionIndicator className={selectionIndicator()} />
        </>
      ))}
    </AriaTab>
  );
};

const TabPanels = <T extends object>(props: TabPanelsProps<T>) => {
  return (
    <AriaTabPanels
      {...props}
      className={cn(
        "relative h-(--tab-panel-height) overflow-clip motion-safe:transition-[height]",
        props.className,
      )}
    />
  );
};

const tabPanelVariants = tv({
  extend: focusRing,
  base: [
    "flex-1 p-4 text-sm text-fg-boldest transition-opacity",
    "entering:opacity-0",
    "exiting:absolute exiting:inset-0 exiting:opacity-0",
  ],
});

const TabPanel = (props: TabPanelProps) => {
  return (
    <AriaTabPanel
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabPanelVariants({ ...renderProps, className }),
      )}
    />
  );
};

export {
  Tabs,
  type TabsProps,
  tabsVariants,
  TabList,
  type TabListProps,
  tabListVariants,
  Tab,
  type TabProps,
  TabPanels,
  type TabPanelsProps,
  TabPanel,
  type TabPanelProps,
  tabPanelVariants,
};
