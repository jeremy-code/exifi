import { useMemo, type CSSProperties } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import { useShallow } from "zustand/react/shallow";

import { ColumnResizer } from "#components/table/ColumnResizer";
import { ExpandRows } from "#components/table/ExpandRows";
import {
  type ExifEditorStoreActions,
  useExifEditorStoreContext,
} from "#hooks/useExifEditor";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { formatPlural } from "#utils/formatPlural";
import { Badge } from "@exiftools/ui/components/Badge";
import { Link } from "@exiftools/ui/components/Link";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  type TableProps,
} from "@exiftools/ui/components/Table";

import { DeleteCell } from "./-components/DeleteCell";
import { EditCell } from "./-components/EditCell";
import { ValueCell } from "./-components/ValueCell";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- All declarations of 'TableMeta' must have identical type parameters.
  interface TableMeta<TData extends RowData> extends ExifEditorStoreActions {}
}

const columnHelper = createColumnHelper<ExifEntryObject>();
const columns = [
  columnHelper.accessor("ifd", { header: "Ifd" }),
  columnHelper.accessor("tag", { header: "Tag" }),
  columnHelper.accessor("format", { header: "Format" }),
  columnHelper.accessor("formattedValue", { header: "Value", cell: ValueCell }),
  columnHelper.display({ id: "delete", cell: DeleteCell }),
  columnHelper.display({ id: "edit", cell: EditCell }),
];

const fallbackData: ExifEntryObject[] = [];

type ExifEditorIfdProps = TableProps;

const ExifEditorIfd = (props: ExifEditorIfdProps) => {
  const exifDataObject = useExifEditorStoreContext(
    (state) => state.exifDataObject,
  );
  const exifEntryObjects = useMemo(
    () => Object.values(exifDataObject.ifd).flat(),
    [exifDataObject],
  );
  const exifEditorStoreActions = useExifEditorStoreContext(
    useShallow((state) => ({
      updateExifEntry: state.updateExifEntry,
      removeExifEntry: state.removeExifEntry,
      fix: state.fix,
      addImageDimensions: state.addImageDimensions,
    })),
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
    meta: exifEditorStoreActions,
  });

  if (exifEntryObjects.length === 0) {
    return (
      <div>
        There doesn't seem to be any Exif entries.{" "}
        <Link
          color="blue"
          underline
          asChild
          onClick={() => {
            exifEditorStoreActions.fix();
          }}
        >
          <button>Initialize with default entries?</button>
        </Link>
      </div>
    );
  }

  return (
    <Table
      variant="outline"
      className="w-(--table-width) table-fixed"
      style={
        {
          "--table-width": `${table.getCenterTotalSize()}px`,
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
