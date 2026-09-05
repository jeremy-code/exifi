import { formatUserComment } from "@exifi/core/exif/userComment/formatUserComment";
import { parseUserComment } from "@exifi/core/exif/userComment/parseUserComment";

import type { AddEditorResolver } from "../types";

const resolveUserComment: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.tag === "USER_COMMENT") {
    return {
      kind: "userComment",
      exifEntryObject,
      value:
        exifEntryObject.value.length !== 0
          ? parseUserComment(exifEntryObject.value)
          : {
              encoding: "ASCII",
              value: "",
            },
      onValueChange: (value) =>
        onValueChange(Array.from(formatUserComment(value))),
    };
  }

  return null;
};

export { resolveUserComment };
