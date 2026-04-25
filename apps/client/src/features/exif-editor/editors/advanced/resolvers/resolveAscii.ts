import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

import type { AdvancedEditorResolver } from "../types";

const resolveAscii: AdvancedEditorResolver = (
  exifEntryObject,
  value,
  onValueChange,
) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      exifEntryObject,
      value: decodeStringFromUtf8(new Uint8Array(value)),
      onValueChange: (value) => {
        onValueChange(Array.from(encodeStringToUtf8(value)));
      },
    };
  }

  return null;
};

export { resolveAscii };
