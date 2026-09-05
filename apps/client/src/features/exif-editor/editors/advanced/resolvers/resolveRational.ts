import { mapRationalArray } from "../../../../../../../../packages/core/src/exif/utils/mapRationalArray";
import type { AdvancedEditorResolver } from "../types";

const resolveRational: AdvancedEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL"
  ) {
    return {
      kind: "rational",
      exifEntryObject,
      values: mapRationalArray(exifEntryObject.value).map((rational) => ({
        numerator: rational.numerator,
        denominator: rational.denominator,
      })),
      onValueChange: (rationalObject, index) => {
        onValueChange(
          exifEntryObject.value.toSpliced(
            index * 2,
            2,
            rationalObject.numerator,
            rationalObject.denominator,
          ),
        );
      },
    };
  }
  return null;
};

export { resolveRational };
