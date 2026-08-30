import {
  formatDateStamp,
  parseDateStamp,
} from "@exifi/core/exif/date/dateStamp";

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
          ? parseDateStamp(exifEntryObject.value)
          : undefined,
      onValueChange: (value) =>
        onValueChange(value !== undefined ? formatDateStamp(value) : ""),
    };
  }

  return null;
};

export { resolveDateStamp };
