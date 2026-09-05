import type {
  UserComment,
  Encoding,
} from "@exifi/core/exif/userComment/interfaces";

import { EnumSelect, type EnumSelectProps } from "./EnumSelect";

type UserCommentSelectProps = {
  value?: UserComment;
  onValueChange?: (value: UserComment) => void;
} & Omit<EnumSelectProps, "value" | "values" | "onValueChange">;

const ENCODINGS = new Set([
  "ASCII",
  "UNICODE",
  "EMPTY",
  "JIS",
]) satisfies Set<Encoding>;

const UserCommentSelect = ({
  value,
  onValueChange,
  ...props
}: UserCommentSelectProps) => {
  return (
    <EnumSelect
      {...props}
      value={value?.encoding}
      values={Array.from(ENCODINGS)}
      onValueChange={(selectedValue) => {
        if (ENCODINGS.has(selectedValue as Encoding) && value !== undefined) {
          onValueChange?.({
            encoding: selectedValue as Encoding,
            value: value.value,
          });
        }
      }}
    />
  );
};

export { UserCommentSelect, type UserCommentSelectProps };
