import { ExifData, ExifIfd, mapRationalFromObject } from "libexif-wasm";
import type { DistributedPick } from "type-fest";

import type { ExifEntryObject } from "../interfaces";
import { getOrInsertEntry } from "./getOrInsertEntry";
import { typedArrayInFormat } from "./typedArrayInFormat";

const getValueFromEntryObject = (
  exifEntryObject: DistributedPick<
    ExifEntryObject,
    "ifd" | "tag" | "format" | "value" | "byteOrder"
  > &
    Partial<ExifEntryObject>,
) => {
  if (exifEntryObject.format === "ASCII") {
    return exifEntryObject.value;
  }

  const exifData = ExifData.new();
  exifData.byteOrder = exifEntryObject.byteOrder;
  exifData.fix(); // Initialize any necessary entries
  const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
  // Must be added after tag is set, but before data is set, because of byte order
  const exifEntry = getOrInsertEntry(exifContent, exifEntryObject.tag);
  exifEntry.format = exifEntryObject.format;

  const typedArray =
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL"
      ? mapRationalFromObject(exifEntryObject.value, exifEntryObject.format)
      : typedArrayInFormat(
          // TODO: not sure why it isn't correctly inferring here
          exifEntryObject.value as number[],
          exifEntryObject.format,
        );

  exifEntry.fromTypedArray(typedArray);
  const formattedValue = exifEntry.toString();

  exifData.free();
  return formattedValue;
};

export { getValueFromEntryObject };
