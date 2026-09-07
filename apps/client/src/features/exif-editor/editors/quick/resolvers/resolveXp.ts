import { XP_TAGS } from "@exifi/core/exif/xp/constants";
import { formatXp } from "@exifi/core/exif/xp/formatXp";
import { parseXp } from "@exifi/core/exif/xp/parseXp";

import type { QuickEditorResolver } from "../interfaces";

const resolveXp: QuickEditorResolver = (exifEntryObject, onValueChange) => {
  if (
    exifEntryObject.format === "BYTE" &&
    XP_TAGS.includes(exifEntryObject.tag)
  ) {
    return {
      kind: "xp",
      exifEntryObject,
      value: parseXp(new Uint8Array(exifEntryObject.value)),
      onValueChange: (value) => onValueChange(Array.from(formatXp(value))),
    };
  }

  return null;
};

export { resolveXp };
