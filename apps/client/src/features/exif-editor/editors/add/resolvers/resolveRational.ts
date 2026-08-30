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
      values: exifEntryObject.value,
      onValueChange: (rationalObject, index) => {
        if (exifEntryObject.value.length === 0 && index === 0) {
          onValueChange([rationalObject]);
        } else {
          onValueChange(exifEntryObject.value.with(index, rationalObject));
        }
      },
    };
  }
  return null;
};

export { resolveRational };
