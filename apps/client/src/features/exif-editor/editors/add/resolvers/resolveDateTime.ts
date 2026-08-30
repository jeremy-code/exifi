import { DATETIME_TAGS } from "#lib/exif/date/constants";
import { formatExifDateTime } from "#lib/exif/date/dateTime/formatExifDateTime";
import { parseExifDateTime } from "#lib/exif/date/dateTime/parseExifDateTime";

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
          ? parseExifDateTime(exifEntryObject.value)
          : undefined,
      onValueChange: (value) =>
        onValueChange(value !== undefined ? formatExifDateTime(value) : ""),
    };
  }

  return null;
};

export { resolveDateTime };
