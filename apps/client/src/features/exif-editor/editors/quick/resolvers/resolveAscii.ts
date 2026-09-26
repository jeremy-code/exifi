import type { QuickEditorResolver } from "../interfaces";

const resolveAscii: QuickEditorResolver = (exifEntryObject, onValueChange) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      value: exifEntryObject.value,
      onValueChange,
    };
  }

  return null;
};

export { resolveAscii };
