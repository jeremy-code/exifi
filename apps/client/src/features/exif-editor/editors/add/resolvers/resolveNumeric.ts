import type { AddEditorResolver } from "../interfaces";

const resolveNumeric: AddEditorResolver = (exifEntryObject, onValueChange) => {
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
      hasIndeterminateSize: true,
      values: exifEntryObject.value,
      onValueChange: (newValue, index) => {
        if (exifEntryObject.value.length === 0 && index === 0) {
          onValueChange([newValue]);
        } else {
          onValueChange(exifEntryObject.value.with(index, newValue));
        }
      },
    };
  }
  return null;
};

export { resolveNumeric };
