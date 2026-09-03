import { decodeStringFromUtf8 } from "@exifi/utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import type { AdvancedEditorResolver } from "../types";

const resolveAscii: AdvancedEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      exifEntryObject,
      value: decodeStringFromUtf8(new Uint8Array(exifEntryObject.value)),
      onValueChange: (value) => {
        onValueChange(Array.from(encodeStringToUtf8(value)));
      },
    };
  }

  return null;
};

export { resolveAscii };
