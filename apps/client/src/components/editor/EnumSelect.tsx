import type { ComponentPropsWithRef, ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exifi/ui/components/Select";

type EnumSelectProps = {
  value: string;
  values: string[];
  onValueChange: (value: string) => void;
  placeholder?: ReactNode;
} & Omit<ComponentPropsWithRef<typeof Select>, "onValueChange">;

const EnumSelect = ({
  value,
  values,
  onValueChange,
  placeholder,
  ...props
}: EnumSelectProps) => {
  return (
    <Select
      {...props}
      value={value}
      onValueChange={(value) => {
        if (value in values) {
          onValueChange?.(value);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { EnumSelect };
