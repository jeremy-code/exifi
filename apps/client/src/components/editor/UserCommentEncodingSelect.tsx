import { ENCODING_TO_HEADER_MAP } from "@exifi/core/exif/userComment/constants";
import type {
  UserComment,
  Encoding,
} from "@exifi/core/exif/userComment/interfaces";

import { EnumSelect, type EnumSelectProps } from "./EnumSelect";

type UserCommentEncodingSelectProps = {
  value?: UserComment;
  onValueChange?: (value: UserComment) => void;
} & Omit<EnumSelectProps, "value" | "values" | "onValueChange">;

const UserCommentEncodingSelect = ({
  value: userComment,
  onValueChange: onUserCommentChange,
  ...props
}: UserCommentEncodingSelectProps) => {
  return (
    <EnumSelect
      {...props}
      value={userComment?.encoding}
      values={Object.keys(ENCODING_TO_HEADER_MAP)}
      onValueChange={(value) => {
        if (value in ENCODING_TO_HEADER_MAP && userComment !== undefined) {
          onUserCommentChange?.({
            encoding: value as Encoding,
            value: userComment.value,
          });
        }
      }}
    />
  );
};

export { UserCommentEncodingSelect, type UserCommentEncodingSelectProps };
