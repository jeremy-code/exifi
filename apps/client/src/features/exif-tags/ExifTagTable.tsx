import { useMemo, type CSSProperties } from "react";

import { flexRender, useTable } from "@tanstack/react-table";
import { getExifTagTable } from "libexif-wasm";
import { useLocale } from "react-aria/I18nProvider";

import { ColumnResizer } from "#components/table/ColumnResizer";
import { ExpandRows } from "#components/table/ExpandRows";
import { SortingHandlerToggle } from "#components/table/SortingHandlerToggle";
import { features } from "#components/table/tableFeatures";
import { formatPlural } from "#utils/formatPlural";
import { Badge } from "@exifi/ui/components/Badge";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableScrollArea,
} from "@exifi/ui/components/Table";

import { columns } from "./components/table/columns";

const exifTagTable = getExifTagTable();

const ExifTagTable = () => {
  const { locale } = useLocale();
  const table = useTable({
    features,
    columns,
    columnResizeMode: "onChange",
    data: exifTagTable,
    initialState: {
      sorting: [{ id: "tagVal", desc: false }],
    },
    enableSorting: true,
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
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- https://tanstack.com/table/latest/docs/framework/react/examples/column-resizing-performant
    [table.state.columnResizing, table.state.columnSizing],
  );
  return (
    <TableScrollArea>
      <Table
        variant="outline"
        className="w-(--table-width) table-fixed"
        style={
          {
            "--table-width": `${table.getCenterTotalSize()}px`,
            ...columnSizeCssVars,
          } as CSSProperties
        }
      >
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader
                  key={header.id}
                  className="group relative w-(--table-header-width)"
                  colSpan={header.colSpan}
                  style={
                    {
                      "--table-header-width": `calc(var(--header-${header.id}-size) * 1px)`,
                    } as CSSProperties
                  }
                >
                  {!header.isPlaceholder ? (
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        {header.column.getCanSort() ? (
                          <SortingHandlerToggle column={header.column}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </SortingHandlerToggle>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                  <ColumnResizer header={header} />
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
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
                  {cell.getIsGrouped() ? (
                    <ExpandRows row={row}>
                      <span className="flex gap-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                        <Badge>
                          {formatPlural(
                            row.subRows.length,
                            {
                              one: " tag",
                              other: " tags",
                            },
                            locale,
                          )}
                        </Badge>
                      </span>
                    </ExpandRows>
                  ) : cell.getIsAggregated() ? (
                    flexRender(
                      cell.column.columnDef.aggregatedCell ??
                        cell.column.columnDef.cell,
                      cell.getContext(),
                    )
                  ) : !cell.getIsPlaceholder() ? (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableScrollArea>
  );
};

export { ExifTagTable };
