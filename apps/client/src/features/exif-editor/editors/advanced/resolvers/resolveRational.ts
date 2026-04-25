import { mapRationalToObject } from "libexif-wasm";

import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";

import type { AdvancedEditorResolver } from "../types";

const resolveRational: AdvancedEditorResolver = (
  exifEntryObject,
  value,
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
        newTypedArrayInFormat(value, exifEntryObject.format),
      ),
      onValueChange: (rationalObject, index) => {
        onValueChange(
          value.toSpliced(
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
