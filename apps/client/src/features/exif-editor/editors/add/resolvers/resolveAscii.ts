import type { AddEditorResolver } from "../interfaces";

const resolveAscii: AddEditorResolver = (exifEntryObject, onValueChange) => {
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
