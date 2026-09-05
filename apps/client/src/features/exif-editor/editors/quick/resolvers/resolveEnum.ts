import { EXIF_TAG_MAP } from "@exifi/core/exif/exifTagMap";
import { typedArrayInFormat } from "@exifi/core/exif/utils/typedArrayInFormat";

import type { QuickEditorResolver } from "../types";

const resolveEnum: QuickEditorResolver = (entry, onValueChange) => {
  const mappedTag = EXIF_TAG_MAP[entry.tag];

  if (
    mappedTag === undefined ||
    entry.components !== 1 ||
    mappedTag.values === undefined ||
    entry.formattedValue === null ||
    !(entry.formattedValue in mappedTag.values)
  ) {
    return null;
  }

  const values = mappedTag.values;

  return {
    kind: "enum",
    exifEntryObject: entry,
    value: entry.formattedValue,
    values: Object.keys(values),
    onValueChange: (value) => {
      if (value in values && values[value] !== undefined) {
        onValueChange(typedArrayInFormat([values[value]], entry.format));
      }
    },
  };
};

export { resolveEnum };
