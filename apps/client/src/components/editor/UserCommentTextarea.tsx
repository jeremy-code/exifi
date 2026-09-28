import type { UserComment } from "@exifi/core/exif/userComment/interfaces";
import {
  TextAreaField,
  type TextAreaFieldProps,
} from "@exifi/ui/components/TextAreaField";

type UserCommentTextareaProps = {
  value?: UserComment;
  onValueChange?: (value: UserComment) => void;
} & Omit<TextAreaFieldProps, "value" | "onChange">;

const UserCommentTextarea = ({
  value: userComment,
  onValueChange: onUserCommentChange,
  ...props
}: UserCommentTextareaProps) => {
  return (
    <TextAreaField
      {...props}
      value={userComment?.value}
      onChange={(nextValue) => {
        if (userComment !== undefined) {
          onUserCommentChange?.({ ...userComment, value: nextValue });
        }
      }}
    />
  );
};

export { UserCommentTextarea };
