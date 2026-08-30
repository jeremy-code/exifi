import {
  mapRationalToObject,
  type ExifData,
  type ExifEntry,
} from "libexif-wasm";

import type {
  ExifDataObject,
  ExifEntryObject,
  ExifIfdObject,
} from "../interfaces";

const EMPTY_EXIF_IFD_OBJECT: ExifIfdObject = {
  IFD_0: [],
  IFD_1: [],
  EXIF: [],
  GPS: [],
  INTEROPERABILITY: [],
};

const serializeExifEntry = (entry: ExifEntry): ExifEntryObject | null => {
  const ifd = entry.ifd;

  if (entry.tag === null || entry.format === null || ifd === null) {
    return null;
  }

  const baseExifEntry = {
    ifd,
    tag: entry.tag,
    format: entry.format,
    components: entry.components,
    data: Array.from(entry.data),
    dataAsTypedArray: Array.from(entry.toTypedArray()),
    size: entry.size,
    formattedValue: entry.toString(),
    byteOrder: entry.byteOrder,
  };

  if (baseExifEntry.format === "ASCII") {
    return {
      ...baseExifEntry,
      format: baseExifEntry.format,
      value: entry.toString(),
    };
  } else if (
    baseExifEntry.format === "RATIONAL" ||
    baseExifEntry.format === "SRATIONAL"
  ) {
    return {
      ...baseExifEntry,
      format: baseExifEntry.format,
      value: mapRationalToObject(entry.toTypedArray()),
    };
  } else {
    return {
      ...baseExifEntry,
      format: baseExifEntry.format,
      value: baseExifEntry.dataAsTypedArray,
    };
  }
};

/**
 * Serializes {@link ExifData} into a {@link ExifDataObject} object. Uint8Arrays
 * are converted into Arrays, and {@link ExifEntry} are converted to
 * {@link ExifEntryObject} with {@link serializeExifEntry}.
 */
const serializeExifData = (exifData: ExifData): ExifDataObject => {
  const ifd = exifData.ifd.reduce(
    (acc, exifContent) => {
      const ifdName = exifContent.ifd;
      if (ifdName !== null && exifContent.count !== 0) {
        acc[ifdName] = exifContent.entries.reduce<ExifEntryObject[]>(
          (acc, currExifEntry) => {
            const exifEntryObject = serializeExifEntry(currExifEntry);
            if (exifEntryObject !== null) {
              acc.push(exifEntryObject);
            }
            return acc;
          },
          [],
        );
      }
      return acc;
    },
    { ...EMPTY_EXIF_IFD_OBJECT },
  );

  return {
    data: Array.from(exifData.data),
    ifd,
    dataType: exifData.dataType,
    byteOrder: exifData.byteOrder,
  };
};

export { serializeExifEntry, serializeExifData };
