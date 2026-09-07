import type { QuickEditorResolver } from "../interfaces";

const resolveSimpleRational: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    (exifEntryObject.format === "SRATIONAL" ||
      exifEntryObject.format === "RATIONAL") &&
    exifEntryObject.components === 1 &&
    exifEntryObject.value[0]?.numerator !== undefined &&
    exifEntryObject.value[1]?.denominator === 1
  ) {
    return {
      kind: "simpleNumeric",
      exifEntryObject,
      value: exifEntryObject.value[0].numerator,
      onValueChange: (value) =>
        onValueChange([{ numerator: value, denominator: 1 }]),
    };
  }
  return null;
};

export { resolveSimpleRational };
