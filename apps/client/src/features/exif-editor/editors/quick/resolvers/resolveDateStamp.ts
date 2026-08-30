import { EXIF_DATESTAMP_REGEX } from "@exifi/core/exif/date/constants";
import {
  formatDateStamp,
  parseDateStamp,
} from "@exifi/core/exif/date/dateStamp";

import type { QuickEditorResolver } from "../types";

const resolveDateStamp: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "DATE_STAMP" &&
    EXIF_DATESTAMP_REGEX.test(exifEntryObject.formattedValue ?? "")
  ) {
    return {
      kind: "dateStamp",
      exifEntryObject,
      value: parseDateStamp(exifEntryObject.formattedValue ?? ""),
      onValueChange: (value) => onValueChange(formatDateStamp(value)),
    };
  }

  return null;
};

export { resolveDateStamp };
