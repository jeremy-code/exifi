import {
  parseTimeStamp,
  formatTimeStamp,
} from "@exifi/core/exif/date/timeStamp";

import type { AddEditorResolver } from "../types";

const resolveTimeStamp: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "TIME_STAMP" &&
    exifEntryObject.format === "RATIONAL" &&
    (exifEntryObject.value.length === 0 || exifEntryObject.value.length === 6)
  ) {
    return {
      kind: "timeStamp",
      exifEntryObject,
      value:
        exifEntryObject.value.length === 0
          ? undefined
          : parseTimeStamp(exifEntryObject.value),
      onValueChange: (value) =>
        onValueChange(value === undefined ? [] : formatTimeStamp(value)),
    };
  }

  return null;
};

export { resolveTimeStamp };
