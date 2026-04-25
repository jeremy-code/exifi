import { useMemo, type CSSProperties } from "react";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import type { Ifd } from "libexif-wasm";
import { useShallow } from "zustand/react/shallow";

import { ColumnResizer } from "#components/table/ColumnResizer";
import { ExpandRows } from "#components/table/ExpandRows";
import {
  type ExifEditorStoreActions,
  useExifEditorStoreContext,
} from "#hooks/useExifEditor";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { formatPlural } from "#utils/formatPlural";
import { Badge } from "@exifi/ui/components/Badge";
import { Link } from "@exifi/ui/components/Link";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  type TableProps,
} from "@exifi/ui/components/Table";

import { AddEntryDialog } from "./dialogs/AddEntryDialog";
import { AddGpsEntriesDialog } from "./dialogs/AddGpsEntriesDialog";
import { DeleteEntriesDialog } from "./dialogs/DeleteEntriesDialog";
import { columns } from "./table/columns";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- All declarations of 'TableMeta' must have identical type parameters.
  interface TableMeta<TData extends RowData> extends ExifEditorStoreActions {}
}

const fallbackData: ExifEntryObject[] = [];

type ExifTableProps = TableProps;

const ExifTable = (props: ExifTableProps) => {
  const exifDataObject = useExifEditorStoreContext(
    (state) => state.exifDataObject,
  );
  const exifEntryObjects = useMemo(
    () =>
      (Object.entries(exifDataObject.ifd) as [Ifd, ExifEntryObject[]][]).map(
        ([ifd, entries]) => ({ ifd, entries }),
      ),
    [exifDataObject],
  );
  const exifEditorStoreActions = useExifEditorStoreContext(
    useShallow((state) => ({
      updateExifEntry: state.updateExifEntry,
      removeExifEntry: state.removeExifEntry,
      removeExifEntries: state.removeExifEntries,
      addExifEntry: state.addExifEntry,
      fix: state.fix,
      addImageDimensions: state.addImageDimensions,
      updateLatLng: state.updateLatLng,
    })),
  );
  const table = useReactTable({
    columns,
    getSubRows: (originalRow) =>
      "entries" in originalRow ? originalRow.entries : undefined,
    columnResizeMode: "onChange",
    data: exifEntryObjects ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      expanded: true,
    },
    meta: exifEditorStoreActions,
  });

  const columnSizeCssVars = useMemo(
    () =>
      table
        .getFlatHeaders()
        .reduce<Record<`--${string}`, number>>((acc, header) => {
          acc[`--header-${header.id}-size`] = header.getSize();
          acc[`--col-${header.column.id}-size`] = header.column.getSize();
          return acc;
        }, {}),
    // eslint-disable-next-line react-compiler/react-compiler -- See below
    // eslint-disable-next-line react-hooks/exhaustive-deps -- https://tanstack.com/table/latest/docs/framework/react/examples/column-resizing-performant
    [table.getState().columnSizingInfo, table.getState().columnSizing],
  );

  if (exifEntryObjects.length === 0) {
    return (
      <div>
        {"There doesn't seem to be any Exif entries. "}
        <Link color="blue" underline asChild>
          <button
            onClick={() => {
              exifEditorStoreActions.fix();
            }}
          >
            Initialize with default entries?
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Table
        variant="outline"
        className="max-w-full min-w-(--table-width) table-fixed"
        style={
          {
            "--table-width": `${table.getCenterTotalSize()}px`,
            ...columnSizeCssVars,
          } as CSSProperties
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
                      "--table-header-width": `calc(var(--header-${header.id}-size) * 1px)`,
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
            <TableRow
              className="hover:bg-subtle/50 has-focus:bg-subtle data-[selected=true]:bg-subtle"
              data-selected={row.getIsSelected()}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="w-(--table-cell-size)"
                  style={
                    {
                      "--table-cell-size": `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    } as CSSProperties
                  }
                >
                  {cell.getIsGrouped() ?
                    <ExpandRows row={row}>
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
      <div className="flex gap-2">
        <DeleteEntriesDialog table={table} />
        <AddEntryDialog />
        <AddGpsEntriesDialog />
      </div>
    </>
  );
};

export { ExifTable, type ExifTableProps };
