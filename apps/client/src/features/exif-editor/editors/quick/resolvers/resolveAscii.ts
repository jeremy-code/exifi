import type { QuickEditorResolver } from "../interfaces";

const resolveAscii: QuickEditorResolver = (exifEntryObject, onValueChange) => {
  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      exifEntryObject,
      value: exifEntryObject.formattedValue ?? "",
      onValueChange,
    };
  }

  return null;
};

export { resolveAscii };
