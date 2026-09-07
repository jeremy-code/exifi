import { exifFormatGetSize } from "libexif-wasm";

import type { QuickEditorResolver } from "../interfaces";

const resolveSimpleNumeric: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    (exifEntryObject.format === "BYTE" ||
      exifEntryObject.format === "LONG" ||
      exifEntryObject.format === "SBYTE" ||
      exifEntryObject.format === "UNDEFINED" ||
      exifEntryObject.format === "SSHORT" ||
      exifEntryObject.format === "SHORT" ||
      exifEntryObject.format === "SLONG") &&
    exifEntryObject.components === 1 &&
    exifEntryObject.size === exifFormatGetSize(exifEntryObject.format) &&
    exifEntryObject.value[0] !== undefined
  ) {
    return {
      kind: "simpleNumeric",
      exifEntryObject,
      value: exifEntryObject.value[0],
      onValueChange: (value) => onValueChange([value]),
    };
  }

  return null;
};

export { resolveSimpleNumeric };
