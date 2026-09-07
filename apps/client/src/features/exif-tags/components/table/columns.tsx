import { createColumnHelper } from "@tanstack/react-table";
import { type TagEntry } from "libexif-wasm";

import { type Features } from "#components/table/tableFeatures";

import { NameCell } from "./NameCell";
import { SupportLevelCell } from "./SupportLevelCell";
import { TagCell } from "./TagCell";

const columnHelper = createColumnHelper<Features, TagEntry>();

/**
 * Column sizes are based on a total size of 64rem (breakpoint lg) for the table
 */
const columns = columnHelper.columns([
  columnHelper.accessor("tagVal", {
    header: "Tag",
    size: 80, // --spacing(20) = 5rem
    cell: TagCell,
  }),
  columnHelper.accessor("title", {
    header: "Name",
    size: 308, // --spacing(77) = 19.25rem
    cell: NameCell,
  }),
  columnHelper.group({
    id: "supportLevel",
    header: "Support Level",
    size: 636, // --spacing(159) = 39.75rem
    columns: columnHelper.columns([
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
        header: () => "Interop.",
        cell: SupportLevelCell,
      }),
    ]),
  }),
]);

export { columns };
