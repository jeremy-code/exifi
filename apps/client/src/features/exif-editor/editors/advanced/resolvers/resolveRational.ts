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
      values: exifEntryObject.value,
      onValueChange: (rationalObject, index) =>
        onValueChange(exifEntryObject.value.with(index, rationalObject)),
    };
  }
  return null;
};

export { resolveRational };
