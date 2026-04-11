import type { CellContext } from "@tanstack/react-table";

import { EXIF_TAG_VALUE_MAP } from "#lib/exif/exifTagValueMap";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { dayjs } from "#utils/date";
import { Input } from "@exiftools/ui/components/Input";

import { EnumValueCell } from "./EnumValueCell";

type ValueCellProps = CellContext<
  ExifEntryObject,
  ExifEntryObject["formattedValue"]
>;

const EXIF_TIMESTAMP_FORMAT = "YYYY:MM:DD HH:mm:ss";
const DATETIME_LOCAL_FORMAT = "YYYY-MM-DDTHH:mm:ss";

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
      <Input
        className="focus:border-border focus:bg-background"
        type={isDateTime ? "datetime-local" : "text"}
        value={
          !isDateTime ? value : (
            dayjs(value, EXIF_TIMESTAMP_FORMAT).format(DATETIME_LOCAL_FORMAT)
          )
        }
        onChange={(e) => {
          if (!isDateTime) {
            table.options.meta?.updateExifEntry(row.original, e.target.value);
          } else {
            if (e.target.value !== "") {
              table.options.meta?.updateExifEntry(
                row.original,
                dayjs(Date.parse(e.target.value)).format(EXIF_TIMESTAMP_FORMAT),
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
