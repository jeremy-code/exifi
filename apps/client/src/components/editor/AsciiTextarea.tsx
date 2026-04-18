import { useMemo } from "react";

import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
import {
  Textarea,
  type TextareaProps,
} from "@exiftools/ui/components/Textarea";

type AsciiTextareaProps = {
  value: number[];
  setValue: (value: number[]) => void;
} & Omit<TextareaProps, "value">;

const AsciiTextarea = ({ value, setValue, ...props }: AsciiTextareaProps) => {
  const asciiValue = useMemo(
    () => decodeStringFromUtf8(new Uint8Array(value)),
    [value],
  );

  return (
    <Textarea
      {...props}
      value={asciiValue}
      onChange={(event) => {
        setValue(Array.from(encodeStringToUtf8(event.target.value)));
      }}
    />
  );
};

export { AsciiTextarea, type AsciiTextareaProps };
