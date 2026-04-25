import type { CellContext } from "@tanstack/react-table";
import { ExifTagInfo } from "libexif-wasm";

import { DateInput } from "#components/editor/DateInput";
import { DatetimeLocalInput } from "#components/editor/DatetimeLocalInput";
import { EnumSelect } from "#components/editor/EnumSelect";
import { ExifVersionInput } from "#components/editor/ExifVersionInput";
import { GpsTagVersionInput } from "#components/editor/GpsTagVersionInput";
import { NumberInput } from "#components/editor/NumberInput";
import { classifyExifEntry } from "#features/exif-editor/utils/classifyExifEntry";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { assertNever } from "#utils/assertNever";
import { Input } from "@exifi/ui/components/Input";

import type { ExifTableRow } from "./columns";

type ValueCellProps = CellContext<
  ExifTableRow,
  ExifEntryObject["formattedValue"]
>;

const ValueCell = ({ row, getValue, table }: ValueCellProps) => {
  const originalRow = row.original;

  if ("entries" in originalRow) {
    return null;
  }

  const classification = classifyExifEntry(originalRow, (value) =>
    table.options.meta?.updateExifEntry(originalRow, value),
  );

  if (classification === null) {
    return getValue() ?? "";
  }
  const className = "focus:border-border focus:bg-background";

  switch (classification.kind) {
    case "enum":
    case "enumAscii":
      return (
        <EnumSelect
          placeholder={`Select a value for ${ExifTagInfo.getTitleInIfd(originalRow.tag, originalRow.ifd)}`}
          {...classification.ctx}
        />
      );
    case "dateStamp":
      return <DateInput className={className} {...classification.ctx} />;
    case "versionId":
      return (
        <GpsTagVersionInput className={className} {...classification.ctx} />
      );
    case "datetime":
      return (
        <DatetimeLocalInput className={className} {...classification.ctx} />
      );
    case "ascii":
      return (
        <Input
          className={className}
          type="text"
          value={classification.ctx.value}
          onChange={(e) => classification.ctx.onValueChange(e.target.value)}
        />
      );
    case "exifVersion":
      return <ExifVersionInput className={className} {...classification.ctx} />;
    case "number":
      return <NumberInput className={className} {...classification.ctx} />;
    default:
      assertNever(classification);
  }
};

export { ValueCell, type ValueCellProps };
