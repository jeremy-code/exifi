import { ExifData, ExifIfd, mapRationalFromObject } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import { getOrInsertEntry } from "./getOrInsertEntry";
import { typedArrayInFormat } from "./typedArrayInFormat";

const getValueFromEntryObject = (
  exifEntryObject: Pick<
    ExifEntryObject,
    "ifd" | "tag" | "format" | "value" | "byteOrder"
  > &
    Partial<ExifEntryObject>,
) => {
  const exifData = ExifData.new();
  exifData.byteOrder = exifEntryObject.byteOrder;
  exifData.fix(); // Initialize any necessary entries
  const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
  // Must be added after tag is set, but before data is set, because of byte order
  const exifEntry = getOrInsertEntry(exifContent, exifEntryObject.tag);
  exifEntry.format = exifEntryObject.format;

  const typedArray =
    exifEntryObject.format === "ASCII"
      ? encodeStringToUtf8(exifEntryObject.value)
      : exifEntryObject.format === "RATIONAL" ||
          exifEntryObject.format === "SRATIONAL"
        ? mapRationalFromObject(exifEntryObject.value, exifEntryObject.format)
        : typedArrayInFormat(
            exifEntryObject.value as number[],
            exifEntryObject.format,
          );

  exifEntry.fromTypedArray(typedArray);
  const formattedValue = exifEntry.toString();

  exifData.free();
  return formattedValue;
};

export { getValueFromEntryObject };
