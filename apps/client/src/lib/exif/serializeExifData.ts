import type {
  ExifData,
  ExifIfdKey,
  ExifFormatKey,
  ExifTagUnifiedKey,
  ExifDataTypeKey,
  ExifByteOrderKey,
  ExifEntry,
} from "libexif-wasm";

import { getEntryValue, type EntryValue } from "./getEntryValue";

type ExifIfd = Exclude<ExifIfdKey, "COUNT">;

type ExifEntryObject = {
  ifd: ExifIfd;
  tag: ExifTagUnifiedKey;
  format: ExifFormatKey;
  components: number;
  data: number[];
  size: number;
  value: EntryValue;
  formattedValue: string | null;
};

type ExifIfdObject = Record<ExifIfd, ExifEntryObject[]>;

type ExifDataObject = {
  ifd: ExifIfdObject;
  data: number[];
  dataType: ExifDataTypeKey | null;
  byteOrder: ExifByteOrderKey | null;
};

const EMPTY_EXIF_IFD_OBJECT: ExifIfdObject = {
  IFD_0: [],
  IFD_1: [],
  EXIF: [],
  GPS: [],
  INTEROPERABILITY: [],
};

const serializeExifEntry = (entry: ExifEntry): ExifEntryObject | null => {
  const ifd = entry.getIfd();

  if (entry.tag === null || entry.format === null || ifd === null) {
    return null;
  }

  return {
    ifd,
    tag: entry.tag,
    format: entry.format,
    components: entry.components,
    data: Array.from(entry.data),
    size: entry.size,
    value: getEntryValue(entry),
    formattedValue: entry.getValue(),
  };
};

/**
 * Serializes {@link ExifData} into a {@link ExifDataObject} object. Uint8Arrays
 * are converted into Arrays, and {@link ExifEntry} are converted to
 * {@link ExifEntryObject} with {@link serializeExifEntry}.
 */
const serializeExifData = (exifData: ExifData): ExifDataObject => {
  const ifd = exifData.ifd.reduce(
    (acc, exifContent) => {
      const ifdName = exifContent.getIfd();
      if (ifdName !== null && exifContent.count !== 0) {
        acc[ifdName] = exifContent.entries
          .map(serializeExifEntry)
          .filter((entry) => entry !== null);
      }
      return acc;
    },
    { ...EMPTY_EXIF_IFD_OBJECT },
  );

  return {
    data: Array.from(exifData.data),
    ifd,
    dataType: exifData.getDataType(),
    byteOrder: exifData.getByteOrder(),
  };
};

export {
  serializeExifEntry,
  type ExifEntryObject,
  type ExifIfdObject,
  type ExifDataObject,
  serializeExifData,
};
