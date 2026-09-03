import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import type { QuickEditorResolver } from "../types";

const resolveEnumAscii: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  const mappedTag = EXIF_TAG_MAP[exifEntryObject.tag];

  if (
    mappedTag === undefined ||
    // ASCII enum values are single characters; components = 1 char + null terminator
    exifEntryObject.components !== 2 ||
    mappedTag.asciiValues === undefined ||
    exifEntryObject.formattedValue === null
  ) {
    return null;
  }

  const asciiValues = mappedTag.asciiValues;
  const asciiEntry = Object.entries(asciiValues).find(
    ([, value]) => value === exifEntryObject.formattedValue,
  );

  if (asciiEntry === undefined) {
    return null;
  }

  return {
    kind: "enumAscii",
    exifEntryObject,
    value: asciiEntry[0],
    values: Object.keys(asciiValues),
    onValueChange: (value) => {
      if (value in asciiValues && asciiValues[value] !== undefined) {
        onValueChange(encodeStringToUtf8(asciiValues[value]));
      }
    },
  };
};

export { resolveEnumAscii };
