import type { ComponentPropsWithRef } from "react";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "tailwind-variants";

const {
  Root: Combobox,
  Value: ComboboxValue,
  Collection: ComboboxCollection,
  useFilter,
  useFilteredItems,
} = ComboboxPrimitive;

const ComboboxLabel = ({
  className,
  ...props
}: ComboboxPrimitive.Label.Props) => {
  return (
    <ComboboxPrimitive.Label
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
};

const ComboboxActionButtons = ({
  className,
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "absolute right-2 bottom-0 flex h-10 items-center justify-center text-muted-foreground",
        className,
      )}
    >
      <ComboboxPrimitive.Clear className="combobox-clear flex h-10 w-6 items-center justify-center rounded bg-transparent p-0">
        <X size={16} />
      </ComboboxPrimitive.Clear>
      <ComboboxPrimitive.Trigger className="flex h-10 w-6 items-center justify-center rounded bg-transparent p-0">
        <ComboboxPrimitive.Icon>
          <ChevronDown size={16} />
        </ComboboxPrimitive.Icon>
      </ComboboxPrimitive.Trigger>
    </div>
  );
};

type ComboboxInputProps = {
  inputProps?: ComboboxPrimitive.Input.Props;
} & ComboboxPrimitive.InputGroup.Props;

const ComboboxInput = ({
  className,
  inputProps,
  children,
  ...props
}: ComboboxInputProps) => {
  return (
    <ComboboxPrimitive.InputGroup
      className={cn(
        "relative box-content flex min-h-9 w-full items-center rounded-sm border bg-surface text-sm/5 hover:border-border-hover",
        "[&>input]:pr-8",
        "has-[.combobox-clear]:[&>input]:pr-[calc(0.5rem+1.5rem*2)]",
        className,
      )}
      {...props}
    >
      <ComboboxPrimitive.Input
        className="size-full border-0 bg-transparent pl-3.5 text-base font-normal text-unsubtle outline-none"
        {...inputProps}
      />
      <ComboboxActionButtons />
      {children}
    </ComboboxPrimitive.InputGroup>
  );
};

const ComboboxList = ({
  className,
  ...props
}: ComboboxPrimitive.List.Props) => {
  return (
    <ComboboxPrimitive.List
      className={cn(
        "max-h-[min(--spacing(92),var(--available-height))] scroll-py-2 overflow-y-auto overscroll-contain py-2 outline-0 data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
};

type ComboboxPortalProps = {
  positionerProps?: ComboboxPrimitive.Positioner.Props;
} & ComboboxPrimitive.Portal.Props;

const ComboboxPortal = ({
  className,
  positionerProps,
  children,
  ...props
}: ComboboxPortalProps) => {
  return (
    <ComboboxPrimitive.Portal {...props}>
      <ComboboxPrimitive.Positioner
        {...positionerProps}
        // Looks like Radix UI Dialog and Combobox portals conflict, see
        // radix-ui/primitives#3694
        className={cn(
          "scroll pointer-events-auto z-[calc(infinity)] outline-none",
          positionerProps?.className,
        )}
      >
        {children}
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};

const ComboboxPopup = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props) => {
  return (
    <ComboboxPrimitive.Popup
      {...props}
      className={cn(
        "max-h-92 w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-md border bg-surface shadow-xs transition-[transform,scale,opacity] duration-100",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "dark:shadow-none dark:-outline-offset-1",
      )}
    >
      {children}
    </ComboboxPrimitive.Popup>
  );
};

const ComboboxEmpty = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Empty.Props) => {
  return (
    <ComboboxPrimitive.Empty {...props}>
      <div
        className={cn("p-4 text-[0.925rem]/4 text-muted-foreground", className)}
      >
        {children}
      </div>
    </ComboboxPrimitive.Empty>
  );
};

const ComboboxItem = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) => {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-8 pl-4 text-base/4 outline-none select-none",
        "data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white",
        "data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-accent",
        className,
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator className="col-start-1">
        <Check size={16} className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
      <span className="col-start-2">{children}</span>
    </ComboboxPrimitive.Item>
  );
};

const ComboboxSeparator = ({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) => {
  return (
    <ComboboxPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
};

export {
  Combobox,
  ComboboxValue,
  ComboboxLabel,
  ComboboxActionButtons,
  ComboboxInput,
  ComboboxPortal,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxCollection,
  useFilter,
  useFilteredItems,
};
