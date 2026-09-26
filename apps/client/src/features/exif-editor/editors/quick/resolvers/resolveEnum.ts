import { EXIF_TAG_MAP } from "@exifi/core/exif/exifTagMap";

import type { QuickEditorResolver } from "../interfaces";

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
    // TODO: For now, resolveEnum uses formattedValue as its value instead of
    // value. This is slightly more convenient, and doesn't really matter in
    // terms of performance, since unlike ASCII, you can't exactly repeatedly
    // update a Select input
    value: entry.formattedValue,
    values: Object.keys(values),
    onValueChange: (value) => {
      if (value in values && values[value] !== undefined) {
        onValueChange([values[value]]);
      }
    },
  };
};

export { resolveEnum };
