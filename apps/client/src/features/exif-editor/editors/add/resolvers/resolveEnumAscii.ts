import { EXIF_TAG_MAP } from "@exifi/core/exif/exifTagMap";

import type { AddEditorResolver } from "../types";

const resolveEnumAscii: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.tag === undefined) {
    return null;
  }

  const mappedTag = EXIF_TAG_MAP[exifEntryObject.tag];

  if (mappedTag === undefined || mappedTag.asciiValues === undefined) {
    return null;
  }

  const asciiValues = mappedTag.asciiValues;

  const valueAsString =
    exifEntryObject.value.length === 0 ? undefined : exifEntryObject.value;

  const asciiValue =
    valueAsString !== undefined
      ? Object.entries(asciiValues).find(
          ([, value]) => value === valueAsString,
        )?.[0]
      : undefined;

  if (asciiValue === undefined && exifEntryObject.value.length === 2) {
    return null;
  }

  return {
    kind: "enumAscii",
    exifEntryObject,
    value: asciiValue,
    values: Object.keys(asciiValues),
    onValueChange: (value) => {
      if (value === "") {
        onValueChange(value);
      }
      if (value in asciiValues && asciiValues[value] !== undefined) {
        onValueChange(asciiValues[value]);
      }
    },
  };
};

export { resolveEnumAscii };
