import { DATETIME_TAGS } from "@exifi/core/exif/date/constants";
import { formatDateTime, parseDateTime } from "@exifi/core/exif/date/dateTime";

import type { AddEditorResolver } from "../types";

const resolveDateTime: AddEditorResolver = (exifEntryObject, onValueChange) => {
  if (
    exifEntryObject.tag !== undefined &&
    exifEntryObject.format === "ASCII" &&
    DATETIME_TAGS.includes(exifEntryObject.tag)
  ) {
    return {
      kind: "datetime",
      exifEntryObject,
      value:
        exifEntryObject.value.length !== 0
          ? parseDateTime(exifEntryObject.value)
          : undefined,
      onValueChange: (value) =>
        onValueChange(value !== undefined ? formatDateTime(value) : ""),
    };
  }

  return null;
};

export { resolveDateTime };
