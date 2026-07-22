import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

import type { AddEditorResolver } from "../types";

const resolveAscii: AddEditorResolver = (exifEntryObject, onValueChange) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      exifEntryObject,
      value:
        exifEntryObject.value.length === 0
          ? undefined
          : decodeStringFromUtf8(new Uint8Array(exifEntryObject.value)),
      onValueChange: (value) => {
        if (value === "") {
          onValueChange([]);
        }

        return onValueChange(Array.from(encodeStringToUtf8(value)));
      },
    };
  }

  return null;
};

export { resolveAscii };
