import type { QuickEditorResolver } from "../types";

const resolveVersionId: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "VERSION_ID" &&
    exifEntryObject.format === "BYTE" &&
    exifEntryObject.size === 4 &&
    exifEntryObject.components === 4
  ) {
    return {
      kind: "versionId",
      exifEntryObject,
      value: exifEntryObject.value,
      onValueChange: (value) => onValueChange(new Uint8Array(value)),
    };
  }

  return null;
};

export { resolveVersionId };
