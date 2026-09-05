import { mapRationalToObject } from "libexif-wasm";

import type { AddEditorResolver } from "../types";

const resolveRational: AddEditorResolver = (exifEntryObject, onValueChange) => {
  if (
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL"
  ) {
    return {
      kind: "rational",
      exifEntryObject,
      hasIndeterminateSize: true,
      values: mapRationalToObject(
        exifEntryObject.format === "RATIONAL"
          ? new Uint32Array(exifEntryObject.value)
          : new Int32Array(exifEntryObject.value),
      ),
      onValueChange: (rationalObject, index) => {
        if (exifEntryObject.value.length === 0 && index === 0) {
          onValueChange([rationalObject.numerator, rationalObject.denominator]);
        } else {
          onValueChange(
            exifEntryObject.value.toSpliced(
              index * 2,
              2,
              rationalObject.numerator,
              rationalObject.denominator,
            ),
          );
        }
      },
    };
  }
  return null;
};

export { resolveRational };
