import { formatUserComment } from "@exifi/core/exif/userComment/formatUserComment";
import { parseUserComment } from "@exifi/core/exif/userComment/parseUserComment";

import type { AdvancedEditorResolver } from "../interfaces";

const resolveUserComment: AdvancedEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "USER_COMMENT" &&
    exifEntryObject.format === "UNDEFINED"
  ) {
    return {
      kind: "userComment",
      value: parseUserComment(exifEntryObject.value),
      onValueChange: (value) =>
        onValueChange(Array.from(formatUserComment(value))),
    };
  }

  return null;
};

export { resolveUserComment };
