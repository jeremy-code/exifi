import { XP_TAGS } from "#lib/exif/xp/constants";
import { formatXp } from "#lib/exif/xp/formatXp";
import { parseXp } from "#lib/exif/xp/parseXp";

import type { AddEditorResolver } from "../types";

const resolveXp: AddEditorResolver = (exifEntryObject, onValueChange) => {
  if (
    exifEntryObject.format === "BYTE" &&
    exifEntryObject.tag !== undefined &&
    XP_TAGS.includes(exifEntryObject.tag)
  ) {
    return {
      kind: "xp",
      exifEntryObject,
      value:
        exifEntryObject.value.length === 0
          ? undefined
          : parseXp(new Uint8Array(exifEntryObject.value)),
      onValueChange: (value) => {
        if (value === "") {
          onValueChange([]);
        }

        return onValueChange(Array.from(formatXp(value)));
      },
    };
  }

  return null;
};

export { resolveXp };
