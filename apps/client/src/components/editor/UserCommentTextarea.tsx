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
  value,
  onValueChange,
  ...props
}: UserCommentTextareaProps) => {
  return (
    <TextAreaField
      {...props}
      value={value?.value}
      onChange={(target) => {
        if (value !== undefined) {
          onValueChange?.({ ...value, value: target });
        }
      }}
    />
  );
};

export { UserCommentTextarea };
