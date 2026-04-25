import type { ComponentPropsWithRef } from "react";

import { Fragment } from "react/jsx-runtime";

import { useBreakpoint } from "#hooks/useBreakpoint";
import { Input, type InputProps } from "@exifi/ui/components/Input";

type GpsTagVersionInputProps = {
  value: number[];
  onValueChange: (value: number[]) => void;
  inputProps?: InputProps;
} & ComponentPropsWithRef<"div">;

const GpsTagVersionInput = ({
  className,
  value,
  onValueChange,
  inputProps,
  ...props
}: GpsTagVersionInputProps) => {
  const breakpoint = useBreakpoint("max-sm");

  // There really isn't enough room to edit four values in one line
  if (breakpoint) {
    return value.join(".");
  }

  return (
    <div className="flex items-baseline gap-1" {...props}>
      {value.map((byte, index) => (
        <Fragment key={index}>
          <Input
            {...inputProps}
            size="xs"
            type="number"
            value={byte}
            onChange={(e) => {
              if (!Number.isNaN(e.target.valueAsNumber)) {
                onValueChange(value.with(index, e.target.valueAsNumber));
              }
            }}
          />
          {index !== value.length - 1 && <span>.</span>}
        </Fragment>
      ))}
    </div>
  );
};

export { GpsTagVersionInput, type GpsTagVersionInputProps };
