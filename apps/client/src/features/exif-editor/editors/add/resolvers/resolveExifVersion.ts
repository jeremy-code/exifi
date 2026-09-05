import { formatExifVersion } from "@exifi/core/exif/exifVersion/formatExifVersion";
import { parseExifVersion } from "@exifi/core/exif/exifVersion/parseExifVersion";

import type { AddEditorResolver } from "../types";

const resolveExifVersion: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "EXIF_VERSION" &&
    exifEntryObject.format === "UNDEFINED"
  ) {
    return {
      kind: "exifVersion",
      exifEntryObject,
      value: parseExifVersion(exifEntryObject.value) ?? undefined,
      onValueChange: (value) =>
        onValueChange(Array.from(formatExifVersion(value))),
    };
  }

  return null;
};

export { resolveExifVersion };
