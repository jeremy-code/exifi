import { mapRationalToObject } from "libexif-wasm";

import type { AdvancedEditorResolver } from "../types";

const resolveRational: AdvancedEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL"
  ) {
    return {
      kind: "rational",
      exifEntryObject,
      values: mapRationalToObject(
        exifEntryObject.format === "RATIONAL"
          ? new Uint32Array(exifEntryObject.value)
          : new Int32Array(exifEntryObject.value),
      ),
      onValueChange: (rationalObject, index) => {
        onValueChange(
          exifEntryObject.value.toSpliced(
            index * 2,
            2,
            rationalObject.numerator,
            rationalObject.denominator,
          ),
        );
      },
    };
  }
  return null;
};

export { resolveRational };
