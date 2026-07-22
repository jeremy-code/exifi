import { useState } from "react";

import { Fragment } from "react/jsx-runtime";
import { Group, type GroupProps } from "react-aria-components/Group";

import {
  NumberField,
  type NumberFieldProps,
} from "@exifi/ui/components/NumberField";

const NUMBER_OF_DIGITS = 4;

type GpsTagVersionTuple = [
  number | undefined,
  number | undefined,
  number | undefined,
  number | undefined,
];

type GpsTagVersionInputProps = {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  inputProps?: Omit<NumberFieldProps, "value" | "onChange">;
} & GroupProps;

const GpsTagVersionInput = ({
  className,
  value,
  onValueChange,
  inputProps,
  ...props
}: GpsTagVersionInputProps) => {
  const [gpsTagVersion, setGpsTagVersion] = useState<GpsTagVersionTuple>([
    value?.at(0),
    value?.at(1),
    value?.at(2),
    value?.at(3),
  ]);

  return (
    <Group className="flex items-baseline gap-1" {...props}>
      {gpsTagVersion.map((byte, index) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key -- Index is only reasonable key
        <Fragment key={index}>
          <NumberField
            size="xs"
            {...inputProps}
            aria-label={`${inputProps?.["aria-label"] ?? "GPS Tag Version"}+${index + 1}`}
            value={byte}
            onChange={(number) => {
              const nextGpsTagVersion = gpsTagVersion.with(index, number);

              setGpsTagVersion(nextGpsTagVersion as GpsTagVersionTuple);
              if (nextGpsTagVersion.every((byte) => byte !== undefined)) {
                onValueChange?.(nextGpsTagVersion);
              }
            }}
          />
          {index !== NUMBER_OF_DIGITS - 1 && <span>.</span>}
        </Fragment>
      ))}
    </Group>
  );
};

export { GpsTagVersionInput, type GpsTagVersionInputProps };
