import { ENCODING_TO_HEADER_MAP } from "@exifi/core/exif/userComment/constants";
import type {
  UserComment,
  Encoding,
} from "@exifi/core/exif/userComment/interfaces";

import { EnumSelect, type EnumSelectProps } from "./EnumSelect";

type UserCommentSelectProps = {
  value?: UserComment;
  onValueChange?: (value: UserComment) => void;
} & Omit<EnumSelectProps, "value" | "values" | "onValueChange">;

const UserCommentSelect = ({
  value,
  onValueChange,
  ...props
}: UserCommentSelectProps) => {
  return (
    <EnumSelect
      {...props}
      value={value?.encoding}
      values={Object.keys(ENCODING_TO_HEADER_MAP)}
      onValueChange={(selectedValue) => {
        if (selectedValue in ENCODING_TO_HEADER_MAP && value !== undefined) {
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
