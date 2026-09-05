import { ChevronDown } from "lucide-react";
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  ListBox,
  type ListBoxProps,
  type ListBoxItemProps as SelectItemProps,
  SelectValue,
  type ValidationResult,
} from "react-aria-components/Select";
import { cn, tv } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { focusRing } from "../utils/focusRing";
import {
  ListBoxItem as SelectItem,
  ListBoxSection as SelectSection,
  type ListBoxSectionProps as SelectSectionProps,
} from "./ListBox";
import { Popover } from "./Popover";
import { Description, FieldError, Label } from "./form";

const selectVariants = tv({
  extend: focusRing,
  base: [
    "flex min-h-9 w-full items-center justify-between gap-1 rounded-sm border border-border bg-surface px-2.5 pr-2 text-start text-sm/5 transition-colors",
    "[-webkit-tap-highlight-color:transparent]",
  ],
  variants: {
    isDisabled: {
      false: [
        "text-fg-bold group-invalid/select:outline group-invalid/select:outline-destructive hover:border-fg-subtle pressed:border-fg-muted",
        "forced-colors:group-invalid/select:outline-[Mark]",
      ],
      true: [
        "border-transparent bg-bg-muted text-neutral",
        "forced-colors:text-[GrayText]",
      ],
    },
  },
});

type SelectionMode = "single" | "multiple";

type SelectProps<T extends object, M extends SelectionMode> = {
  children: ListBoxProps<T>["children"];
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  listboxProps?: Omit<ListBoxProps<T>, "children">;
} & Omit<AriaSelectProps<T, M>, "children">;

const Select = <
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Match `AriaSelectProps` type
  T extends object = {},
  M extends SelectionMode = "single",
>({
  className,
  children,
  label,
  description,
  errorMessage,
  items,
  listboxProps,
  ...props
}: SelectProps<T, M>) => {
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        className,
        "group/select relative flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <Button className={selectVariants}>
        <SelectValue className="basis-content line-clamp-1 block truncate text-sm data-[placeholder=true]:text-fg-muted">
          {({ selectedText, defaultChildren }) =>
            selectedText || defaultChildren
          }
        </SelectValue>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-fg-muted group-disabled/select:text-border",
            "forced-colors:text-[ButtonText] forced-colors:group-disabled/select:text-[GrayText]",
          )}
        />
      </Button>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover containerPadding={0}>
        <ListBox
          items={items}
          className={composeTailwindRenderProps(
            listboxProps?.className,
            "max-h-[inherit] overflow-auto p-1 outline-hidden",
          )}
          {...listboxProps}
        >
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
};

export {
  Select,
  type SelectProps,
  selectVariants,
  SelectItem,
  type SelectItemProps,
  SelectSection,
  type SelectSectionProps,
};
