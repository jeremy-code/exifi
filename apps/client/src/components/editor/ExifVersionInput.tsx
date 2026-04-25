import { useMemo, type ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { Input, type InputProps } from "@exifi/ui/components/Input";

const textEncoder = new TextEncoder();

type ExifVersionInputProps = {
  value: number[];
  onValueChange: (value: number[]) => void;
  inputProps?: Omit<InputProps, "value">;
} & ComponentPropsWithRef<"div">;

const ExifVersionInput = ({
  className,
  value,
  onValueChange,
  inputProps,
  ...props
}: ExifVersionInputProps) => {
  const exifVersion = useMemo(
    () => decodeStringFromUtf8(new Uint8Array(value)),
    [value],
  );

  // Everything seems to make sense except 0230 === 2.3?
  const major = parseInt(exifVersion.slice(0, 2));
  const minor = parseInt(exifVersion.slice(2));

  return (
    <div className={cn("flex items-baseline gap-2", className)} {...props}>
      <Input
        {...inputProps}
        type="number"
        min={1}
        max={2}
        value={major}
        onChange={(event) => {
          if (!Number.isNaN(event.target.valueAsNumber)) {
            onValueChange(
              Array.from(
                textEncoder.encode(
                  event.target.valueAsNumber.toString().padStart(2, "0") +
                    minor.toString().padStart(2, "0"),
                ),
              ),
            );
          }
        }}
      />
      .
      <Input
        {...inputProps}
        type="number"
        min={0}
        value={minor}
        onChange={(event) => {
          if (!Number.isNaN(event.target.valueAsNumber)) {
            onValueChange(
              Array.from(
                textEncoder.encode(
                  major.toString().padStart(2, "0") +
                    event.target.valueAsNumber.toString().padStart(2, "0"),
                ),
              ),
            );
          }
        }}
      />
    </div>
  );
};

export { ExifVersionInput, type ExifVersionInputProps };
