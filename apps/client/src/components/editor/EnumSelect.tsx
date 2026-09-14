import {
  Select,
  type SelectProps,
  SelectItem,
} from "@exifi/ui/components/Select";

type EnumItem = {
  id: string;
  value: string;
};

type EnumSelectProps = {
  value?: string;
  values?: string[];
  onValueChange?: (value: string) => void;
} & Omit<
  SelectProps<EnumItem, "single">,
  "value" | "onChange" | "children" | "items"
>;

const EnumSelect = ({
  value,
  values,
  onValueChange,
  ...props
}: EnumSelectProps) => {
  return (
    <Select
      {...props}
      value={value}
      items={values?.map((v) => ({ id: v, value: v }))}
      onChange={(nextValue) => {
        if (nextValue !== null && typeof nextValue === "string") {
          onValueChange?.(nextValue);
        }
      }}
    >
      {(item) => <SelectItem id={item.id}>{item.value}</SelectItem>}
    </Select>
  );
};

export { EnumSelect, type EnumSelectProps };
