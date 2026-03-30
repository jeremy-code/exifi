import { useState, type CSSProperties } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  type CellContext,
  type RowData,
} from "@tanstack/react-table";

import { ColumnResizer } from "#components/table/ColumnResizer";
import { ExpandRows } from "#components/table/ExpandRows";
import { useExifEditorStateStore } from "#hooks/useExifEditorState";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { formatPlural } from "#utils/formatPlural";
import { Badge } from "@exiftools/ui/components/Badge";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  type TableProps,
} from "@exiftools/ui/components/Table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- All declarations of 'TableMeta' must have identical type parameters.
  interface TableMeta<TData extends RowData> {
    updateExifEntry: (
      columnId: "IFD_0" | "IFD_1" | "EXIF" | "GPS" | "INTEROPERABILITY",
      rowIndex: number,
      value: string,
    ) => void;
  }
}

const ValueCell = ({
  getValue,
  row,
  table,
}: CellContext<ExifEntryObject, string | null>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue ?? "");

  return (
    <input
      className="border border-transparent focus:border-border focus:bg-background focus:outline-none"
      disabled={row.original.format !== "ASCII"}
      value={value}
      onBlur={() => {
        table.options.meta?.updateExifEntry(
          row.original.ifd,
          Number(row.id),
          value,
        );
      }}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

const columnHelper = createColumnHelper<ExifEntryObject>();
const columns = [
  columnHelper.accessor("ifd", { header: "Ifd" }),
  columnHelper.accessor("tag", { header: "Tag" }),
  columnHelper.accessor("format", { header: "Format" }),
  columnHelper.accessor("value", { header: "Value", cell: ValueCell }),
];

const fallbackData: ExifEntryObject[] = [];

type ExifEditorIfdProps = {
  exifEntryObjects: ExifEntryObject[];
} & TableProps;

const ExifEditorIfd = ({ exifEntryObjects, ...props }: ExifEditorIfdProps) => {
  const updateExifEntry = useExifEditorStateStore(
    (state) => state.updateExifEntry,
  );
  const table = useReactTable({
    columns,
    columnResizeMode: "onChange",
    data: exifEntryObjects ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      grouping: ["ifd"],
      expanded: true,
    },
    meta: {
      updateExifEntry,
    },
  });

  return (
    <Table
      variant="outline"
      className="w-[--table-width] table-fixed"
      style={
        { "--table-width": `${table.getCenterTotalSize()}px` } as CSSProperties
      }
      {...props}
    >
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeader
                key={header.id}
                className="group relative w-(--table-header-width)"
                style={
                  {
                    "--table-header-width": `${header.getSize()}px`,
                  } as CSSProperties
                }
              >
                {!header.isPlaceholder &&
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                <ColumnResizer header={header} />
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow className="has-focus:bg-subtle" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="w-(--table-cell-size)"
                style={
                  {
                    "--table-cell-size": `${cell.column.getSize()}px`,
                  } as CSSProperties
                }
              >
                {cell.getIsGrouped() ?
                  <ExpandRows row={row}>
                    <span className="flex gap-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                      <Badge>
                        {formatPlural(row.subRows.length, {
                          one: " tag",
                          other: " tags",
                        })}
                      </Badge>
                    </span>
                  </ExpandRows>
                : cell.getIsAggregated() ?
                  flexRender(
                    cell.column.columnDef.aggregatedCell ??
                      cell.column.columnDef.cell,
                    cell.getContext(),
                  )
                : !cell.getIsPlaceholder() ?
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { ExifEditorIfd, type ExifEditorIfdProps };
