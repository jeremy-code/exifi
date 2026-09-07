import { createColumnHelper } from "@tanstack/react-table";
import type { Ifd } from "libexif-wasm";

import { type Features } from "#components/table/tableFeatures";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

import { EditCell } from "./EditCell";
import { IfdCell } from "./IfdCell";
import { SelectCell } from "./SelectCell";
import { SelectHeader } from "./SelectHeader";
import { TagCell } from "./TagCell";
import { ValueCell } from "./ValueCell";

type ExifTableRow = ExifEntryObject | { ifd: Ifd; entries: ExifTableRow[] };

const columnHelper = createColumnHelper<Features, ExifTableRow>();

/**
 * Column sizes are based on a total size of 40rem (breakpoint sm) for the table
 */
const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    aggregatedCell: SelectCell,
    cell: SelectCell,
    header: SelectHeader,
    size: 40, // 2.5rem
  }),
  columnHelper.accessor("ifd", {
    id: "ifd",
    aggregatedCell: IfdCell,
    cell: IfdCell,
    header: "IFD",
    size: 72, // 4.5rem
  }),
  columnHelper.accessor("tag", {
    id: "tag",
    header: "Tag",
    cell: TagCell,
    size: 252, // 15.75rem
  }),
  columnHelper.accessor("formattedValue", {
    header: "Value",
    cell: ValueCell,
    size: 260, // 16.25rem
  }),
  columnHelper.display({
    id: "edit",
    cell: EditCell,
    size: 56, // 3.5rem
  }),
]);

export { type ExifTableRow, columns };
