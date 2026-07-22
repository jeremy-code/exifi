import { formatExifTimeStamp } from "#lib/exif/date/timeStamp/formatExifTimeStamp";
import { parseExifTimeStamp } from "#lib/exif/date/timeStamp/parseExifTimeStamp";

import type { AddEditorResolver } from "../types";

const resolveTimeStamp: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "TIME_STAMP" &&
    (exifEntryObject.value.length === 0 || exifEntryObject.value.length === 6)
  ) {
    return {
      kind: "timeStamp",
      exifEntryObject,
      value:
        exifEntryObject.value.length === 0
          ? undefined
          : parseExifTimeStamp(exifEntryObject.value),
      onValueChange: (value) =>
        onValueChange(value === undefined ? [] : formatExifTimeStamp(value)),
    };
  }

  return null;
};

export { resolveTimeStamp };
