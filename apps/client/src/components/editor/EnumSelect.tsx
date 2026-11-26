import {
  Select,
  type SelectProps,
  SelectItem,
} from "@exifi/ui/components/Select";

type EnumItem = {
  id: string;
  label: string;
};

type EnumSelectProps = {
  value?: string;
  values: string[];
  getLabel?: (value: string) => string;
  onValueChange?: (value: string) => void;
} & Omit<
  SelectProps<EnumItem, "single">,
  "value" | "onChange" | "children" | "items"
>;

const EnumSelect = ({
  value,
  values,
  getLabel,
  onValueChange,
  ...props
}: EnumSelectProps) => {
  return (
    <Select
      {...props}
      value={value}
      items={values.map((v) => ({ id: v, label: getLabel?.(v) ?? v }))}
      onChange={(nextValue) => {
        if (nextValue !== null && typeof nextValue === "string") {
          onValueChange?.(nextValue);
        }
      }}
    >
      {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
    </Select>
  );
};

export { EnumSelect, type EnumSelectProps };
