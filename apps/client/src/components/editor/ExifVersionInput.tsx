import { useState } from "react";

import { Group, type GroupProps } from "react-aria-components/Group";
import { cn } from "tailwind-variants";

import type { ExifVersion } from "#features/exif-editor/editors/shared/interfaces";
import {
  NumberField,
  type NumberFieldProps,
} from "@exifi/ui/components/NumberField";

type ExifVersionInputProps = {
  value?: ExifVersion;
  onValueChange?: (value: ExifVersion) => void;
  inputProps?: Omit<NumberFieldProps, "value" | "onChange">;
} & GroupProps;

const ExifVersionInput = ({
  className,
  value,
  onValueChange,
  inputProps,
  ...props
}: ExifVersionInputProps) => {
  const [exifVersion, setExifVersion] = useState<{
    major: number | undefined;
    minor: number | undefined;
  }>(value ?? { major: undefined, minor: undefined });

  return (
    <Group className={cn("flex items-baseline gap-2", className)} {...props}>
      <NumberField
        {...inputProps}
        aria-label={
          inputProps?.["aria-label"] !== undefined
            ? inputProps["aria-label"] + " Major"
            : "Major"
        }
        size="xs"
        minValue={1}
        maxValue={2}
        value={exifVersion.major}
        onChange={(target) => {
          setExifVersion((prev) => {
            const nextExifVersion = { ...prev, major: target };

            if (
              nextExifVersion.major !== undefined &&
              nextExifVersion.minor !== undefined
            ) {
              onValueChange?.({
                major: nextExifVersion.major,
                minor: nextExifVersion.minor,
              });
            }

            return nextExifVersion;
          });
        }}
      />
      .
      <NumberField
        {...inputProps}
        aria-label={
          inputProps?.["aria-label"] !== undefined
            ? inputProps["aria-label"] + " Minor"
            : "Minor"
        }
        minValue={0}
        size="xs"
        value={exifVersion.minor}
        onChange={(target) => {
          setExifVersion((prev) => {
            const nextExifVersion = { ...prev, minor: target };

            if (
              nextExifVersion.major !== undefined &&
              nextExifVersion.minor !== undefined
            ) {
              onValueChange?.({
                major: nextExifVersion.major,
                minor: nextExifVersion.minor,
              });
            }

            return nextExifVersion;
          });
        }}
      />
    </Group>
  );
};

export { ExifVersionInput, type ExifVersionInputProps };
