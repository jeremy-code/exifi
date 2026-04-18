import { type ComponentPropsWithRef } from "react";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Select as SelectPrimitive, Slot } from "radix-ui";
import { cn, tv, type VariantProps } from "tailwind-variants";

const {
  Root: Select,
  Group: SelectGroup,
  Value: SelectValue,
} = SelectPrimitive;

const selectTriggerVariants = tv({
  base: [
    "flex min-h-9 w-full items-center justify-between gap-1 rounded-sm border px-2.5 text-start text-sm/5 transition-colors",
    "data-placeholder:text-muted-foreground",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  ],
  variants: {
    variant: {
      surface: "border bg-surface hover:border-border-hover",
      outline: "border bg-transparent hover:border-border-hover",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
});

type SelectTriggerProps = ComponentPropsWithRef<
  typeof SelectPrimitive.Trigger
> &
  VariantProps<typeof selectTriggerVariants>;

const SelectTrigger = ({
  className,
  children,
  variant,
  ...props
}: SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    className={selectTriggerVariants({ variant, className })}
    {...props}
  >
    <Slot.Slottable>{children}</Slot.Slottable>
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        className="size-4 text-muted-foreground"
        aria-hidden={true}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({
  className,
  children,
  position = "item-aligned",
  ...props
}: ComponentPropsWithRef<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        "z-[calc(infinity)] overflow-y-auto rounded-sm border bg-surface shadow-xs",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex h-6.5 cursor-default items-center justify-center">
        <ChevronUp className="size-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn("p-1.5", {
          "h-(--radix-select-trigger-height) max-h-(--radix-select-content-avaliable-height) w-(--radix-select-trigger-width) max-w-(--radix-select-content-avaliable-width) origin-(--radix-select-content-transform-origin)":
            position === "popper",
        })}
      >
        <Slot.Slottable>{children}</Slot.Slottable>
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-6.5 cursor-default items-center justify-center">
        <ChevronDown className="size-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    className={cn(
      "relative flex h-6.5 items-center rounded-sm pr-9.5 pl-6.5 text-sm/none select-none",
      "data-disabled:cursor-not-allowed data-disabled:opacity-50",
      "data-highlighted:bg-accent data-highlighted:text-white data-highlighted:outline-none",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6.5 items-center justify-center">
      <Check className="size-4" />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>
      <Slot.Slottable>{children}</Slot.Slottable>
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectLabel = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof SelectPrimitive.Label>) => (
  <SelectPrimitive.Label
    className={cn("px-6.5 text-xs/6 font-semibold text-foreground", className)}
    {...props}
  />
);

const SelectSeparator = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof SelectPrimitive.Separator>) => (
  <SelectPrimitive.Separator
    className={cn("m-1 h-px bg-muted", className)}
    {...props}
  />
);

export {
  selectTriggerVariants,
  Select,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
};
