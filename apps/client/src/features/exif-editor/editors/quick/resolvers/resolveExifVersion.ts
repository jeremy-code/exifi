import { m } from "#paraglide/messages";
import { formatExifVersion } from "@exifi/core/exif/exifVersion/formatExifVersion";
import { parseExifVersion } from "@exifi/core/exif/exifVersion/parseExifVersion";

import type { QuickEditorResolver } from "../interfaces";

const resolveExifVersion: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "EXIF_VERSION" &&
    exifEntryObject.format === "UNDEFINED" &&
    exifEntryObject.size === 4 &&
    exifEntryObject.components === 4
  ) {
    const exifVersion = parseExifVersion(exifEntryObject.value);
    if (exifVersion === null) {
      throw new Error(m.editor_error_invalid_exif_version());
    }

    return {
      kind: "exifVersion",
      value: exifVersion,
      onValueChange: (value) =>
        onValueChange(Array.from(formatExifVersion(value))),
    };
  }

  return null;
};

export { resolveExifVersion };
