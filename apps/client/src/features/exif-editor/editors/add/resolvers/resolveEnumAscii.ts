import { EXIF_TAG_MAP } from "@exifi/core/exif/exifTagMap";
import { decodeStringFromUtf8 } from "@exifi/utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

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
    exifEntryObject.value.length === 0
      ? undefined
      : decodeStringFromUtf8(new Uint8Array(exifEntryObject.value));

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
        onValueChange([]);
      }
      if (value in asciiValues && asciiValues[value] !== undefined) {
        onValueChange(Array.from(encodeStringToUtf8(asciiValues[value])));
      }
    },
  };
};

export { resolveEnumAscii };
