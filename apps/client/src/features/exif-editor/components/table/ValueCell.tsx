import { useMemo, useState } from "react";

import { useDebouncedCallback } from "@tanstack/react-pacer/debouncer";
import type { CellContext } from "@tanstack/react-table";
import { ExifTagInfo } from "libexif-wasm";

import { EnumSelect } from "#components/editor/EnumSelect";
import { ExifVersionInput } from "#components/editor/ExifVersionInput";
import { GpsTagVersionInput } from "#components/editor/GpsTagVersionInput";
import type { Features } from "#components/table/tableFeatures";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { DateField } from "@exifi/ui/components/DateField";
import { DatePicker } from "@exifi/ui/components/DatePicker";
import { NumberField } from "@exifi/ui/components/NumberField";
import { TextField } from "@exifi/ui/components/TextField";
import { TimeField } from "@exifi/ui/components/TimeField";
import { assertNever } from "@exifi/utils/assertNever";

import { getExifQuickEditor } from "../../editors/quick/getExifQuickEditor";
import type { ExifTableRow } from "./columns";

type ValueCellInnerProps = {
  exifEntryObject: ExifEntryObject;
  updateExifEntry?: (
    exifEntryObject: ExifEntryObject,
    value: ExifEntryObject["value"],
  ) => void;
};

const ValueCellInner = ({
  exifEntryObject,
  updateExifEntry,
}: ValueCellInnerProps) => {
  const [value, setValue] = useState(() => exifEntryObject.value);
  const nextExifEntryObject = useMemo(
    () => ({ ...exifEntryObject, value }) as ExifEntryObject,
    [exifEntryObject, value],
  );
  const debouncedOnChange = useDebouncedCallback(
    (nextValue: ExifEntryObject["value"]) => {
      updateExifEntry?.(nextExifEntryObject, nextValue);
    },
    { leading: true, wait: 200 },
  );

  const quickEditor = getExifQuickEditor(nextExifEntryObject, (nextValue) => {
    setValue(nextValue);
    debouncedOnChange(nextValue);
  });

  if (quickEditor === null) {
    return (
      <span className="block truncate">
        {exifEntryObject.formattedValue ?? ""}
      </span>
    );
  }

  const title = ExifTagInfo.getTitleInIfd(
    exifEntryObject.tag,
    exifEntryObject.ifd,
  );
  const label = title !== "" ? title : exifEntryObject.tag;

  switch (quickEditor.kind) {
    case "enum":
    case "enumAscii":
      return (
        <EnumSelect
          placeholder={`Select a value for ${label}`}
          aria-label={label}
          {...quickEditor}
        />
      );
    case "dateStamp":
      return (
        <DateField
          {...quickEditor}
          aria-label={label}
          onChange={(nextValue) => {
            if (nextValue !== null) {
              quickEditor.onValueChange(nextValue);
            }
          }}
        />
      );
    case "versionId":
      return <GpsTagVersionInput aria-label={label} {...quickEditor} />;
    case "datetime":
      return (
        <DatePicker
          {...quickEditor}
          aria-label={label}
          granularity="second"
          onChange={(nextValue) => {
            if (nextValue !== null) {
              quickEditor.onValueChange(nextValue);
            }
          }}
        />
      );
    case "timeStamp":
      return (
        <TimeField
          granularity="second"
          {...quickEditor}
          aria-label={label}
          onChange={(nextValue) => {
            if (nextValue !== null) {
              quickEditor.onValueChange(nextValue);
            }
          }}
        />
      );
    case "ascii":
    case "xp":
      return (
        <TextField
          aria-label={label}
          {...quickEditor}
          onChange={(nextValue) => quickEditor.onValueChange(nextValue)}
        />
      );
    case "exifVersion":
      return (
        <ExifVersionInput
          inputProps={{ "aria-label": label }}
          {...quickEditor}
        />
      );
    case "simpleNumeric":
      return (
        <NumberField
          {...quickEditor}
          aria-label={label}
          onChange={(nextValue) => quickEditor.onValueChange(nextValue)}
        />
      );
    default:
      assertNever(quickEditor);
  }
};

type ValueCellProps = CellContext<
  Features,
  ExifTableRow,
  ExifEntryObject["formattedValue"]
>;

const ValueCell = ({ row, table }: ValueCellProps) => {
  const originalRow = row.original;

  if ("entries" in originalRow) {
    return null;
  }

  return (
    <ValueCellInner
      exifEntryObject={originalRow}
      updateExifEntry={table.options.meta?.updateExifEntry}
    />
  );
};

export { ValueCell, type ValueCellProps };
