import type { Tag } from "libexif-wasm";

/**
 * Date format for Exif GPS tag DATE_STAMP
 *
 * @see {@link https://github.com/libexif/libexif/blob/c7e3330358639bed6ceb1c00f9fb74f4c794448e/libexif/exif-tag.c#L214-L218}
 */
const EXIF_DATESTAMP_REGEX = /^(?<year>\d{4}):(?<month>\d{2}):(?<day>\d{2})$/;

/**
 * Datetime format for Exif tag DATE_TIME, DATE_TIME_ORIGINAL,
 * DATE_TIME_DIGITIZED
 *
 * @see {@link https://github.com/libexif/libexif/blob/c7e3330358639bed6ceb1c00f9fb74f4c794448e/libexif/exif-entry.c#L1718-L1720}
 */
const EXIF_DATETIME_REGEX =
  /^(?<year>\d{4}):(?<month>\d{2}):(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/;

// https://github.com/libexif/libexif/blob/b9b7f3c08c1b6812ad3b9d62227ad9527ab9385a/libexif/exif-entry.c#L1718
const DATETIME_TAGS = [
  "DATE_TIME",
  "DATE_TIME_ORIGINAL",
  "DATE_TIME_DIGITIZED",
] as Tag[];

export { EXIF_DATESTAMP_REGEX, EXIF_DATETIME_REGEX, DATETIME_TAGS };
