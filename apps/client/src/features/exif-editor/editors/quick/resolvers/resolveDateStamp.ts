import { EXIF_DATESTAMP_REGEX } from "@exifi/core/exif/date/constants";
import {
  formatDateStamp,
  parseDateStamp,
} from "@exifi/core/exif/date/dateStamp";

import type { QuickEditorResolver } from "../interfaces";

const resolveDateStamp: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "DATE_STAMP" &&
    exifEntryObject.format === "ASCII" &&
    EXIF_DATESTAMP_REGEX.test(exifEntryObject.value)
  ) {
    return {
      kind: "dateStamp",
      value: parseDateStamp(exifEntryObject.value),
      onValueChange: (value) => onValueChange(formatDateStamp(value)),
    };
  }

  return null;
};

export { resolveDateStamp };
