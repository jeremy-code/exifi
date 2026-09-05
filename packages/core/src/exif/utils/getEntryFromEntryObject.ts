import { ExifIfd, type ExifData } from "libexif-wasm";

import type { ExifEntryObject } from "../interfaces";

const getEntryFromEntryObject = (
  exifData: ExifData,
  exifEntryObject: ExifEntryObject,
) => {
  const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
  const exifEntry = exifContent.getEntry(exifEntryObject.tag);

  if (exifEntry === null) {
    throw new Error(
      `Exif entry with tag ${exifEntryObject.tag} was not found.`,
    );
  }
  return exifEntry;
};

export { getEntryFromEntryObject };
