import { useMemo } from "react";

import { parseUserComment } from "#lib/exif/parseUserComment";
import { Textarea, type TextareaProps } from "@exifi/ui/components/Textarea";

type UserCommentTextareaProps = {
  value: number[];
  setValue: (value: number[]) => void;
} & Omit<TextareaProps, "value">;

const textEncoder = new TextEncoder();

const UserCommentTextarea = ({
  value,
  setValue,
  ...props
}: UserCommentTextareaProps) => {
  const textareaValue = useMemo(() => parseUserComment(value), [value]);

  return (
    <Textarea
      {...props}
      value={textareaValue}
      onChange={(event) => {
        setValue([
          ...value.slice(0, 8),
          ...Array.from(textEncoder.encode(event.target.value)),
        ]);
      }}
    />
  );
};

export { UserCommentTextarea };
