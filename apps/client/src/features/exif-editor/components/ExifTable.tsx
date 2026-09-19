import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import {
  flexRender,
  useTable,
  type RowData,
  type RowSelectionState,
  type TableFeatures,
} from "@tanstack/react-table";
import type { Ifd } from "libexif-wasm";
import { Button as AriaButton } from "react-aria-components/Button";
import { useShallow } from "zustand/react/shallow";

import { ColumnResizer } from "#components/table/ColumnResizer";
import { ExpandRows } from "#components/table/ExpandRows";
import { features } from "#components/table/tableFeatures";
import { m } from "#paraglide/messages";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { Badge } from "@exifi/ui/components/Badge";
import { linkVariants } from "@exifi/ui/components/Link";
import {
  TableScrollArea,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  type TableProps,
} from "@exifi/ui/components/Table";

import { useExifEditor } from "../contexts/ExifEditorContext";
import type { ExifEditorStoreActions } from "../stores/exifEditorStore";
import { SelectionBar } from "./table/SelectionBar";
import { columns } from "./table/columns";

declare module "@tanstack/react-table" {
  interface TableMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
  > extends Pick<ExifEditorStoreActions, "updateExifEntry"> {}
}

const fallbackData: ExifEntryObject[] = [];

type ExifTableProps = TableProps;

const ExifTable = (props: ExifTableProps) => {
  const { exifDataObject, exifData, updateExifDataObject } = useExifEditor(
    useShallow((state) => ({
      exifDataObject: state.exifDataObject,
      exifData: state.exifData,
      updateExifDataObject: state.updateExifDataObject,
    })),
  );
  const exifContentObjects = useMemo(
    () =>
      (Object.entries(exifDataObject.ifd) as [Ifd, ExifEntryObject[]][]).map(
        ([ifd, entries]) => ({ ifd, entries }),
      ),
    [exifDataObject],
  );
  const updateExifEntry = useExifEditor((state) => state.updateExifEntry);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useTable({
    features,
    columns,
    getSubRows: (originalRow) =>
      "entries" in originalRow ? originalRow.entries : undefined,
    columnResizeMode: "onChange",
    data: exifContentObjects ?? fallbackData,
    onRowSelectionChange: setRowSelection,
    initialState: {
      expanded: true,
    },
    state: {
      rowSelection,
    },
    meta: {
      updateExifEntry,
    },
  });
  const tableRef = useRef<HTMLTableElement>(null);

  useLayoutEffect(
    () => {
      const setColumnSizeCssVars = () => {
        const tableElement = tableRef.current;

        if (tableElement !== null) {
          table.getFlatHeaders().forEach((header) => {
            tableElement.style.setProperty(
              `--header-${header.id}-size`,
              String(header.getSize()),
            );
            tableElement.style.setProperty(
              `--col-${header.column.id}-size`,
              String(header.column.getSize()),
            );
          });
          tableElement.style.setProperty(
            `--table-width`,
            `${table.getTotalSize()}px`,
          );
        }
      };
      setColumnSizeCssVars();

      const { unsubscribe } =
        table.atoms.columnSizing.subscribe(setColumnSizeCssVars);

      return () => {
        unsubscribe();
      };
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- https://tanstack.com/table/latest/docs/framework/react/examples/column-resizing-performant
    [],
  );

  if (
    exifContentObjects.every(
      (exifContentObject) => exifContentObject.entries.length === 0,
    )
  ) {
    return (
      <div className="mb-2 text-base">
        <ParaglideMessage
          message={m["green_caring_albatross_blend"]}
          markup={{
            button: (buttonProps) => (
              <AriaButton
                className={(renderProps) =>
                  linkVariants({
                    ...renderProps,
                    color: "blue",
                    underline: true,
                  })
                }
                onPress={() => {
                  exifData.fix();
                  updateExifDataObject();
                }}
                {...buttonProps}
              />
            ),
          }}
        />
      </div>
    );
  }

  return (
    <TableScrollArea>
      <Table
        variant="outline"
        className="min-w-(--table-width) table-fixed"
        {...props}
        ref={tableRef}
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
              className="hover:bg-bg-subtle/50 has-focus:bg-bg-subtle data-[selected=true]:bg-bg-subtle"
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
                  {cell.getIsGrouped() ? (
                    <ExpandRows row={row}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                      <Badge>
                        {m.wise_curly_mallard_embrace({
                          count: row.subRows.length,
                        })}
                      </Badge>
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
      <SelectionBar rowSelection={rowSelection} table={table} />
    </TableScrollArea>
  );
};

export { ExifTable, type ExifTableProps };
