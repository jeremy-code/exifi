import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  ComboBoxValue,
  ListBox,
} from "react-aria-components/ComboBox";

import { useLocalizedUiStringFormatter } from "../hooks/useLocalizedStringFormatter";
import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { FieldButton } from "./FieldButton";
import {
  ListBoxItem as ComboBoxItem,
  type ListBoxItemProps as ComboBoxItemProps,
  ListBoxSection as ComboBoxSection,
  type ListBoxSectionProps as ComboBoxSectionProps,
  type ListBoxProps,
} from "./ListBox";
import { Popover, type PopoverProps } from "./Popover";
import {
  Description,
  FieldError,
  FieldGroup,
  Input,
  Label,
  type FieldErrorMessage,
} from "./form";

type SelectionMode = "single" | "multiple";

type ComboBoxProps<T extends object, M extends SelectionMode> = {
  children: ReactNode | ((item: T) => ReactNode);
  placeholder?: string;
  label?: string;
  description?: string | null;
  errorMessage?: FieldErrorMessage;
  popoverProps?: PopoverProps;
  listBoxProps?: Omit<ListBoxProps<T>, "items" | "children">;
} & Omit<AriaComboBoxProps<T, M>, "children">;

const ComboBox = <T extends object, M extends SelectionMode = "single">({
  label,
  description,
  errorMessage,
  children,
  items,
  popoverProps,
  listBoxProps,
  ...props
}: ComboBoxProps<T, M>) => {
  const stringFormatter = useLocalizedUiStringFormatter();

  return (
    <AriaComboBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <Input className="ps-3 pe-1" />
        <FieldButton className="mr-1 w-6 outline-offset-0">
          <ChevronDown aria-hidden className="size-4" />
        </FieldButton>
      </FieldGroup>
      {props.selectionMode === "multiple" && (
        <ComboBoxValue
          placeholder={stringFormatter.format("combobox.selectedCount", {
            count: 0,
          })}
          className="text-xs text-fg-muted"
        />
      )}
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="w-(--trigger-width)" {...popoverProps}>
        <ListBox
          items={items}
          {...listBoxProps}
          className={composeTailwindRenderProps(
            listBoxProps?.className,
            "max-h-[inherit] overflow-auto p-1 outline-none",
          )}
        >
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
};

export {
  ComboBox,
  type ComboBoxProps,
  ComboBoxItem,
  type ComboBoxItemProps,
  ComboBoxSection,
  type ComboBoxSectionProps,
};
