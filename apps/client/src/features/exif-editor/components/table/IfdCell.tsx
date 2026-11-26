import type { CellContext } from "@tanstack/react-table";
import type { Ifd } from "libexif-wasm";

import { ExpandRows } from "#components/table/ExpandRows";
import type { Features } from "#components/table/tableFeatures";
import { getExifIfdName } from "#lib/exif/labels";
import { m } from "#paraglide/messages";
import { Badge } from "@exifi/ui/components/Badge";

import type { ExifTableRow } from "./columns";

const IfdCell = ({
  row,
  getValue,
}: CellContext<Features, ExifTableRow, Ifd>) => {
  if ("entries" in row.original || row.getCanExpand()) {
    return (
      <ExpandRows row={row}>
        {getExifIfdName(getValue())}
        <Badge variant="muted">
          {m.editor_table_tag_count({
            count: row.getCanExpand() ? row.subRows.length : 0,
          })}
        </Badge>
      </ExpandRows>
    );
  }

  return null;
};

export { IfdCell };
