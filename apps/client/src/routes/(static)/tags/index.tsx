import type { CSSProperties } from "react";

import { createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext,
} from "@tanstack/react-table";
import {
  getExifTagTable,
  type SupportLevel,
  type TagEntry,
} from "libexif-wasm";

import { ColumnResizer } from "#components/table/ColumnResizer";
import { ExpandRows } from "#components/table/ExpandRows";
import { SortingHandlerToggle } from "#components/table/SortingHandlerToggle";
import { formatPlural } from "#utils/formatPlural";
import { titlecase } from "#utils/titlecase";
import { Badge } from "@exiftools/ui/components/Badge";
import { Heading } from "@exiftools/ui/components/Heading";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@exiftools/ui/components/Table";

const exifTagTable = getExifTagTable();

const columnHelper = createColumnHelper<TagEntry>();

const SupportLevelCell = (props: CellContext<TagEntry, SupportLevel>) => {
  const value = props.getValue();

  if (value === "UNKNOWN") {
    return (
      <span className="text-muted-foreground italic">{titlecase(value)}</span>
    );
  }

  return (
    <Badge
      className="select-text"
      color={value === "MANDATORY" ? "success" : "default"}
    >
      {titlecase(value)}
    </Badge>
  );
};

const columns = [
  columnHelper.group({
    id: "information",
    header: "Information",
    columns: [
      columnHelper.accessor("tagVal", { header: "Tag" }),
      columnHelper.accessor("name", { header: "Name" }),
    ],
  }),
  columnHelper.group({
    id: "supportLevel",
    header: "Support Level",
    columns: [
      columnHelper.accessor("esl.IFD_0", {
        header: () => "IFD 0",
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.IFD_1", {
        header: () => "IFD 1",
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.EXIF", {
        header: () => "EXIF",
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.GPS", {
        header: () => "GPS",
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.INTEROPERABILITY", {
        header: () => "Interoperability",
        cell: SupportLevelCell,
      }),
    ],
  }),
];

const TagsComponent = () => {
  const table = useReactTable({
    columns,
    columnResizeMode: "onChange",
    data: exifTagTable,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: "tagVal", desc: false }],
    },
    enableSorting: true,
  });

  return (
    <div className="flex flex-col gap-2">
      <Heading as="h1" size="2xl" className="mb-4">
        Exif tags
      </Heading>

      <Table
        variant="outline"
        className="w-(--table-width) table-fixed"
        style={
          {
            "--table-width": `${table.getCenterTotalSize()}px`,
          } as CSSProperties
        }
      >
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader
                  key={header.id}
                  className="group w-(--table-header-width)"
                  colSpan={header.colSpan}
                  style={
                    {
                      "--table-header-width": `${header.getSize()}px`,
                    } as CSSProperties
                  }
                >
                  {!header.isPlaceholder ?
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        {header.column.getCanSort() ?
                          <SortingHandlerToggle column={header.column}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </SortingHandlerToggle>
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        }
                      </div>
                    </div>
                  : null}
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
    </div>
  );
};

const Route = createFileRoute("/(static)/tags/")({
  component: TagsComponent,
});

export { Route };
