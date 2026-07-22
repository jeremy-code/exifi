import { Children } from "react";

import { Check, ChevronRight, Dot } from "lucide-react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuProps,
  type MenuItemProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  Separator,
  type SeparatorProps as MenuSeparatorProps,
  Header,
  Collection,
  type SubmenuTriggerProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Text,
} from "react-aria-components/Menu";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { cn } from "tailwind-variants";

import { listBoxItemVariants } from "./ListBox";
import { Popover, type PopoverProps } from "./Popover";
import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";

const Menu = <T extends object>(props: MenuProps<T>) => {
  return (
    <AriaMenu
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "max-h-[inherit] overflow-auto p-1 outline-hidden select-none [clip-path:inset(0_0_0_0_round_.75rem)] empty:pb-2 empty:text-center",
      )}
    />
  );
};

const MenuItem = (props: MenuItemProps) => {
  const textValue =
    props.textValue ??
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <AriaMenuItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className, renderProps) =>
        listBoxItemVariants({ ...renderProps, className }),
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {isSelected && selectionMode === "multiple" ? (
              <Check aria-hidden className="size-4" />
            ) : null}
            {isSelected && selectionMode === "single" ? (
              <Dot aria-hidden className="size-4" />
            ) : null}
            {typeof children === "string" ? (
              <Text
                slot="label"
                className="flex flex-1 items-center gap-2 truncate font-normal group-selected/list-box-item:font-semibold"
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {hasSubmenu && (
              <ChevronRight aria-hidden className="absolute right-2 size-4" />
            )}
          </>
        ),
      )}
    </AriaMenuItem>
  );
};

const MenuSeparator = (props: MenuSeparatorProps) => {
  return (
    <Separator
      {...props}
      className={cn("mx-3 my-1 border-b border-border", props.className)}
    />
  );
};

type MenuSectionProps<T> = {
  title?: string;
} & AriaMenuSectionProps<T>;

const MenuSection = <T extends object>(props: MenuSectionProps<T>) => {
  return (
    <AriaMenuSection
      {...props}
      className={cn(
        "first:-mt-1.25",
        "after:block after:h-1.25 after:content-['']",
        props.className,
      )}
    >
      {props.title && (
        <Header
          className={cn(
            "sticky -top-1.25 z-10 -mx-1 -mt-px truncate border-y px-4 py-1 text-sm font-semibold backdrop-blur-md",
            "border-y-gray-200 dark:border-y-gray-700",
            "bg-gray-100/60 dark:bg-gray-700/60",
            "text-gray-500 dark:text-gray-300",
            "supports-[-moz-appearance:none]:bg-gray-100",
            "[&+*]:mt-1",
          )}
        >
          {props.title}
        </Header>
      )}
      <Collection items={props.items} dependencies={props.dependencies}>
        {props.children}
      </Collection>
    </AriaMenuSection>
  );
};

type MenuTriggerProps = {
  placement?: PopoverProps["placement"];
} & AriaMenuTriggerProps;

const MenuTrigger = (props: MenuTriggerProps) => {
  /**
   * @see {@link https://github.com/adobe/react-spectrum/blob/6ffb87e7d6f9083b3566d881deea5296fb38aa28/packages/%40adobe/react-spectrum/src/menu/MenuTrigger.tsx#L81}
   * @see {@link https://react-aria.adobe.com/Menu}
   */
  // eslint-disable-next-line @eslint-react/no-children-to-array -- Per documentation, this is correct
  const [trigger, menu] = Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaMenuTrigger {...props}>
      {trigger}
      <Popover placement={props.placement} className="min-w-37.5">
        {menu}
      </Popover>
    </AriaMenuTrigger>
  );
};

const SubmenuTrigger = (props: SubmenuTriggerProps) => {
  // eslint-disable-next-line @eslint-react/no-children-to-array -- See MenuTrigger, above
  const [trigger, menu] = Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover showArrow={false} offset={-2} crossOffset={-4}>
        {menu}
      </Popover>
    </AriaSubmenuTrigger>
  );
};

export {
  Menu,
  type MenuProps,
  MenuItem,
  type MenuItemProps,
  MenuSeparator,
  type MenuSeparatorProps,
  MenuSection,
  type MenuSectionProps,
  MenuTrigger,
  type MenuTriggerProps,
  SubmenuTrigger,
  type SubmenuTriggerProps,
};
