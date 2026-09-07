import type { AdvancedEditorResolver } from "../interfaces";

const resolveAscii: AdvancedEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      value: exifEntryObject.value,
      onValueChange: (value) => onValueChange(value),
    };
  }

  return null;
};

export { resolveAscii };
