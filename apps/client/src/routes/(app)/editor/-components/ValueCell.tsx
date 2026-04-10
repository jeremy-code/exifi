import type { CellContext } from "@tanstack/react-table";

import { EXIF_TAG_VALUE_MAP } from "#lib/exif/exifTagValueMap";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";

import { EnumValueCell } from "./EnumValueCell";

type ValueCellProps = CellContext<
  ExifEntryObject,
  ExifEntryObject["formattedValue"]
>;

const EXIF_TIMESTAMP_REGEX =
  /^(?<year>\d{4}):(?<month>\d{2}):(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/;

const convertExifTimestampToIsoTimestamp = (exifTimestamp: string) => {
  return exifTimestamp.replace(
    EXIF_TIMESTAMP_REGEX,
    "$<year>-$<month>-$<day>T$<hour>:$<minute>:$<second>",
  );
};

const formatDateAsExifTimestamp = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
};

// https://github.com/libexif/libexif/blob/b9b7f3c08c1b6812ad3b9d62227ad9527ab9385a/libexif/exif-entry.c#L1718
const DATETIME_TAGS = [
  "DATE_TIME",
  "DATE_TIME_ORIGINAL",
  "DATE_TIME_DIGITIZED",
];

const ValueCell = ({ getValue, row, table }: ValueCellProps) => {
  const value = getValue() ?? "";
  const isAscii = row.original.format === "ASCII";
  const isDateTime = DATETIME_TAGS.includes(row.original.tag);
  const isEnum =
    row.original.tag in EXIF_TAG_VALUE_MAP &&
    row.original.components === 1 &&
    value in
      EXIF_TAG_VALUE_MAP[row.original.tag as keyof typeof EXIF_TAG_VALUE_MAP];

  if (isEnum) {
    return (
      <EnumValueCell
        exifEntryObject={row.original}
        value={value}
        updateExifEntry={table.options.meta!.updateExifEntry}
      />
    );
  }

  // All DateTime inputs are also ASCII format, so this is fine
  if (isAscii) {
    return (
      <input
        className="border border-transparent focus:border-border focus:bg-background focus:outline-none"
        type={isDateTime ? "datetime-local" : "text"}
        value={!isDateTime ? value : convertExifTimestampToIsoTimestamp(value)}
        onChange={(e) => {
          if (!isDateTime) {
            table.options.meta?.updateExifEntry(row.original, e.target.value);
          } else {
            if (e.target.value !== "") {
              table.options.meta?.updateExifEntry(
                row.original,
                formatDateAsExifTimestamp(new Date(Date.parse(e.target.value))),
              );
            }
          }
        }}
      />
    );
  }

  // Return as is. Ideally I would like to have a way to quick edit these in the
  // future, but for now, users can rely on ExifEntryEditor
  return value;
};

export { ValueCell, type ValueCellProps };
