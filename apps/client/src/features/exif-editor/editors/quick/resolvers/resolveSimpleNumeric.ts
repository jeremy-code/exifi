import { exifFormatGetSize } from "libexif-wasm";

import { typedArrayInFormat } from "@exifi/core/exif/utils/typedArrayInFormat";

import type { QuickEditorResolver } from "../types";

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
      onValueChange: (value) =>
        onValueChange(typedArrayInFormat([value], exifEntryObject.format)),
    };
  }

  return null;
};

export { resolveSimpleNumeric };
