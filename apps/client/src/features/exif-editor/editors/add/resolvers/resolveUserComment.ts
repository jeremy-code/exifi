import { formatUserComment } from "@exifi/core/exif/userComment/formatUserComment";
import { parseUserComment } from "@exifi/core/exif/userComment/parseUserComment";

import type { AddEditorResolver } from "../interfaces";

const resolveUserComment: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "USER_COMMENT" &&
    exifEntryObject.format === "UNDEFINED"
  ) {
    return {
      kind: "userComment",
      value:
        exifEntryObject.value.length !== 0
          ? parseUserComment(exifEntryObject.value, exifEntryObject.byteOrder)
          : undefined,
      onValueChange: (value) =>
        onValueChange(
          Array.from(formatUserComment(value, exifEntryObject.byteOrder)),
        ),
    };
  }

  return null;
};

export { resolveUserComment };
