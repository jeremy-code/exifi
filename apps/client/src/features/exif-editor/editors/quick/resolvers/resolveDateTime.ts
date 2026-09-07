import {
  DATETIME_TAGS,
  EXIF_DATETIME_REGEX,
} from "@exifi/core/exif/date/constants";
import { formatDateTime, parseDateTime } from "@exifi/core/exif/date/dateTime";

import type { QuickEditorResolver } from "../interfaces";

const resolveDateTime: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    DATETIME_TAGS.includes(exifEntryObject.tag) &&
    EXIF_DATETIME_REGEX.test(exifEntryObject.formattedValue ?? "")
  ) {
    return {
      kind: "datetime",
      exifEntryObject,
      value: parseDateTime(exifEntryObject.formattedValue ?? ""),
      onValueChange: (value) => onValueChange(formatDateTime(value)),
    };
  }

  return null;
};

export { resolveDateTime };
