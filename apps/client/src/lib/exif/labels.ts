import {
  ExifTagInfo,
  type ByteOrder,
  type DataType,
  type Format,
  type Ifd,
  type SupportLevel,
  type Tag,
} from "libexif-wasm";

import { m } from "#paraglide/messages";

import {
  EXIF_BYTE_ORDER_NAMES,
  EXIF_DATA_TYPE_NAMES,
  EXIF_ENUM_VALUE_LABELS,
  EXIF_FORMAT_NAMES,
  EXIF_IFD_NAMES,
  EXIF_SUPPORT_LEVEL_NAMES,
  EXIF_TAG_DESCRIPTIONS,
  EXIF_TAG_TITLES,
} from "./exifMessages.generated";

/**
 * Falls back to libexif's English title, then libexif's tag name, then the tag
 * identifier.
 */
const getExifTagTitle = (tag: Tag, ifd?: Ifd): string => {
  const message = EXIF_TAG_TITLES[tag];
  if (message !== undefined) {
    return message();
  }
  if (ifd !== undefined) {
    const title = ExifTagInfo.getTitleInIfd(tag, ifd);
    if (title !== "") {
      return title;
    }
    const name = ExifTagInfo.getNameInIfd(tag, ifd);
    if (name !== "") {
      return name;
    }
  }
  return tag;
};

const getExifTagDescription = (tag: Tag, ifd?: Ifd): string => {
  const message = EXIF_TAG_DESCRIPTIONS[tag];
  if (message !== undefined) {
    return message();
  }
  if (EXIF_TAG_TITLES[tag] !== undefined) {
    return "";
  }
  return ifd !== undefined ? ExifTagInfo.getDescriptionInIfd(tag, ifd) : "";
};

const getExifIfdName = (ifd: Ifd): string => EXIF_IFD_NAMES[ifd]();

const getExifSupportLevelName = (level: SupportLevel): string =>
  EXIF_SUPPORT_LEVEL_NAMES[level]();

const getExifFormatName = (format: Format): string =>
  EXIF_FORMAT_NAMES[format]();

const getExifByteOrderName = (byteOrder: ByteOrder): string =>
  EXIF_BYTE_ORDER_NAMES[byteOrder]();

const getExifDataTypeName = (dataType: DataType): string =>
  EXIF_DATA_TYPE_NAMES[dataType]();

const getExifEnumValueLabel = (tag: Tag, key: string): string =>
  EXIF_ENUM_VALUE_LABELS[tag]?.[key]?.() ?? key;

const getExifEntryLabel = (entry: { tag?: Tag; ifd?: Ifd }): string =>
  entry.tag === undefined
    ? m.exif_unknown_tag()
    : getExifTagTitle(entry.tag, entry.ifd);

export {
  getExifTagTitle,
  getExifTagDescription,
  getExifIfdName,
  getExifSupportLevelName,
  getExifEnumValueLabel,
  getExifFormatName,
  getExifByteOrderName,
  getExifDataTypeName,
  getExifEntryLabel,
};
