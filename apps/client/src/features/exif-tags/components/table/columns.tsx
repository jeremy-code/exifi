import { createColumnHelper } from "@tanstack/react-table";
import type { TagEntry } from "libexif-wasm";

import type { Features } from "#components/table/tableFeatures";
import { getExifTagTitle } from "#lib/exif/labels";
import { m } from "#paraglide/messages";

import { NameCell } from "./NameCell";
import { SupportLevelCell } from "./SupportLevelCell";
import { TagCell } from "./TagCell";

const columnHelper = createColumnHelper<Features, TagEntry>();

/**
 * Column sizes are based on a total size of 64rem (breakpoint lg) for the table
 */
const columns = columnHelper.columns([
  columnHelper.accessor("tagVal", {
    header: () => m.viewer_tags_column_tag(),
    size: 80, // --spacing(20) = 5rem
    cell: TagCell,
  }),
  columnHelper.accessor((row) => getExifTagTitle(row.tag), {
    id: "title",
    header: () => m.viewer_tags_column_name(),
    size: 308, // --spacing(77) = 19.25rem
    cell: NameCell,
  }),
  columnHelper.group({
    id: "supportLevel",
    header: () => m.viewer_tags_column_support_level(),
    size: 636, // --spacing(159) = 39.75rem
    columns: columnHelper.columns([
      columnHelper.accessor("esl.IFD_0", {
        header: () => m.viewer_tags_column_ifd_0(),
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.IFD_1", {
        header: () => m.viewer_tags_column_ifd_1(),
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.EXIF", {
        header: () => m.viewer_tags_column_exif(),
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.GPS", {
        header: () => m.viewer_tags_column_gps(),
        cell: SupportLevelCell,
      }),
      columnHelper.accessor("esl.INTEROPERABILITY", {
        header: () => m.viewer_tags_column_interop(),
        cell: SupportLevelCell,
      }),
    ]),
  }),
]);

export { columns };
