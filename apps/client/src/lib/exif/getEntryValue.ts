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

import { Rational } from "#lib/math/Rational";

type EntryValue = string | Rational[] | number[];

const getEntryValue = (exifEntry: ExifEntry): EntryValue => {
  const format = exifEntry.format;
  if (format === null) {
    throw new Error("Entry has null format");
  }

  const byteOrder = exifEntry.byteOrder;
  const size = exifFormatGetSize(format);

  switch (format) {
    case "BYTE":
      return Array.from(exifEntry.data);
    case "ASCII":
      return exifEntry.value;
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
          return new Rational(rational.numerator, rational.denominator);
        }
        case "SRATIONAL": {
          const sRational = exifGetSRational(
            exifEntry.data.subarray(offset, offset + size),
            byteOrder,
          );
          return new Rational(sRational.numerator, sRational.denominator);
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
