import {
  exifGetRational,
  exifFormatGetSize,
  type ExifEntry,
  exifGetShort,
  exifGetLong,
  exifGetSLong,
  exifGetSShort,
  exifGetSRational,
} from "libexif-wasm";

import type { Rational } from "./interfaces";

type EntryValue = string | Rational[] | number[];

const getEntryValue = (exifEntry: ExifEntry): EntryValue => {
  const format = exifEntry.format;
  if (format === null) {
    throw new Error("Entry has null format");
  }

  const byteOrder = exifEntry.parent?.parent?.getByteOrder() ?? "MOTOROLA";
  const size = exifFormatGetSize(format);

  switch (format) {
    case "BYTE":
      return Array.from(exifEntry.data);
    case "ASCII":
      return exifEntry.getValue() ?? "";
    case "UNDEFINED":
      return Array.from(exifEntry.data);
    case "SBYTE":
      return Array.from(exifEntry.data);
  }

  if (format === "RATIONAL" || format === "SRATIONAL") {
    return Array.from({ length: exifEntry.components }, (_, index) => {
      const offset = index * size;

      switch (format) {
        case "RATIONAL": {
          const rational = exifGetRational(
            exifEntry.data.subarray(offset, offset + size),
            byteOrder,
          );
          if (rational.denominator === 0) {
            throw new Error(
              `Exif entry "${exifEntry.tag}" has a rational with a denominator of 0.`,
            );
          }
          return {
            numerator: rational.numerator,
            denominator: rational.denominator,
          };
        }
        case "SRATIONAL": {
          const sRational = exifGetSRational(
            exifEntry.data.subarray(offset, offset + size),
            byteOrder,
          );
          if (sRational.denominator === 0) {
            throw new Error(
              `Exif entry "${exifEntry.tag}" has a signed rational with a denominator of 0.`,
            );
          }
          return {
            numerator: sRational.numerator,
            denominator: sRational.denominator,
          };
        }
      }
    });
  }

  return Array.from({ length: exifEntry.components }, (_, index) => {
    const offset = index * size;

    switch (format) {
      case "SHORT":
        return exifGetShort(
          exifEntry.data.subarray(offset, offset + size),
          byteOrder,
        );
      case "LONG":
        return exifGetLong(
          exifEntry.data.subarray(offset, offset + size),
          byteOrder,
        );
      case "SSHORT":
        return exifGetSShort(
          exifEntry.data.subarray(offset, offset + size),
          byteOrder,
        );
      case "SLONG":
        return exifGetSLong(
          exifEntry.data.subarray(offset, offset + size),
          byteOrder,
        );

      // DOUBLE and FLOAT are unsupported, https://github.com/libexif/libexif/blob/master/libexif/exif-entry.c#L590-L591
      default:
        throw new Error("Unsupported data type");
    }
  });
};

export { getEntryValue, type EntryValue };
