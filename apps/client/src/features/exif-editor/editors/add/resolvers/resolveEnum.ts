import { EXIF_TAG_MAP } from "@exifi/core/exif/exifTagMap";

import type { AddEditorResolver } from "../types";

const resolveEnum: AddEditorResolver = (entry, onValueChange) => {
  if (entry.tag === undefined) {
    return null;
  }

  const mappedTag = EXIF_TAG_MAP[entry.tag];

  if (
    mappedTag === undefined ||
    mappedTag.values === undefined ||
    (entry.value.length !== 0 && entry.value.length !== 1)
  ) {
    return null;
  }

  const values = mappedTag.values;

  const value =
    entry.value.length === 0
      ? undefined
      : Object.entries(values).find(
          ([, index]) => index === entry.value[0],
        )?.[0];

  if (value === undefined && entry.value.length === 1) {
    return null;
  }

  return {
    kind: "enum",
    exifEntryObject: entry,
    value,
    values: Object.keys(values),
    onValueChange: (value) => {
      if (value in values && values[value] !== undefined) {
        onValueChange([values[value]]);
      }
    },
  };
};

export { resolveEnum };
