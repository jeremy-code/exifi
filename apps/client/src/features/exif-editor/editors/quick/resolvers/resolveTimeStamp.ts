import { exifFormatGetSize } from "libexif-wasm";

import { formatExifTimeStamp } from "@exifi/core/exif/date/timeStamp/formatExifTimeStamp";
import { parseExifTimeStamp } from "@exifi/core/exif/date/timeStamp/parseExifTimeStamp";

import type { QuickEditorResolver } from "../types";

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
      value: parseExifTimeStamp(exifEntryObject.value),
      onValueChange: (value) =>
        onValueChange(new Uint32Array(formatExifTimeStamp(value))),
    };
  }

  return null;
};

export { resolveTimeStamp };
