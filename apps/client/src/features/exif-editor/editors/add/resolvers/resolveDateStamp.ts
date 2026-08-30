import { formatExifDateStamp } from "#lib/exif/date/dateStamp/formatExifDateStamp";
import { parseExifDateStamp } from "#lib/exif/date/dateStamp/parseExifDateStamp";

import type { AddEditorResolver } from "../types";

const resolveDateStamp: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "DATE_STAMP" &&
    exifEntryObject.format === "ASCII"
  ) {
    return {
      kind: "dateStamp",
      exifEntryObject,
      value:
        exifEntryObject.value.length !== 0
          ? parseExifDateStamp(exifEntryObject.value)
          : undefined,
      onValueChange: (value) =>
        onValueChange(value !== undefined ? formatExifDateStamp(value) : ""),
    };
  }

  return null;
};

export { resolveDateStamp };
