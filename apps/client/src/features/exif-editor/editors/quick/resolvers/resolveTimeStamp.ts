import { exifFormatGetSize } from "libexif-wasm";

import {
  formatTimeStamp,
  parseTimeStamp,
} from "@exifi/core/exif/date/timeStamp";

import type { QuickEditorResolver } from "../interfaces";

const resolveTimeStamp: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "TIME_STAMP" &&
    exifEntryObject.ifd === "GPS" &&
    exifEntryObject.format === "RATIONAL" &&
    // hours, minutes, seconds
    exifEntryObject.components === 3 &&
    exifEntryObject.size === exifFormatGetSize("RATIONAL") * 3
  ) {
    return {
      kind: "timeStamp",
      exifEntryObject,
      value: parseTimeStamp(exifEntryObject.value),
      onValueChange: (value) => onValueChange(formatTimeStamp(value)),
    };
  }

  return null;
};

export { resolveTimeStamp };
