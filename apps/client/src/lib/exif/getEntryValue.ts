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

const getEntryValue = (exifEntry: ExifEntry) => {
  const format = exifEntry.format;
  if (format === null) {
    throw new Error("Entry has null format");
  }

  const byteOrder = exifEntry.parent?.parent?.getByteOrder() ?? "MOTOROLA";
  const size = exifFormatGetSize("RATIONAL");

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
        return rational.numerator / rational.denominator;
      }
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
        return sRational.numerator / sRational.denominator;
      }
      // DOUBLE and FLOAT are unsupported, https://github.com/libexif/libexif/blob/master/libexif/exif-entry.c#L590-L591
      default:
        throw new Error("Unsupported data type");
    }
  });
};

export { getEntryValue };
