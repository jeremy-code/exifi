import type { AdvancedEditorResolver } from "../types";

const resolveNumeric: AdvancedEditorResolver = (
  exifEntryObject,
  value,
  onValueChange,
) => {
  if (
    exifEntryObject.format === "BYTE" ||
    exifEntryObject.format === "LONG" ||
    exifEntryObject.format === "UNDEFINED" ||
    exifEntryObject.format === "SLONG" ||
    exifEntryObject.format === "SBYTE" ||
    exifEntryObject.format === "SHORT" ||
    exifEntryObject.format === "SSHORT"
  ) {
    return {
      kind: "numeric",
      exifEntryObject,
      values: value,
      onValueChange: (newValue, index) => {
        onValueChange(value.with(index, newValue));
      },
    };
  }
  return null;
};

export { resolveNumeric };
