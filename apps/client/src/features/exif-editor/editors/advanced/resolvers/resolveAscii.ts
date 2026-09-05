import type { AdvancedEditorResolver } from "../types";

const resolveAscii: AdvancedEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      exifEntryObject,
      value: exifEntryObject.value,
      onValueChange: (value) => onValueChange(value),
    };
  }

  return null;
};

export { resolveAscii };
