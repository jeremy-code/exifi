import { ExifData, ExifIfd } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

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

  exifEntry.fromTypedArray(
    typedArrayInFormat(exifEntryObject.value, exifEntryObject.format),
  );
  const formattedValue = exifEntry.toString();

  exifData.free();
  return formattedValue;
};

export { getValueFromEntryObject };
