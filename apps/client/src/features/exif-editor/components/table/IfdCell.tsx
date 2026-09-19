import type { CellContext } from "@tanstack/react-table";
import { exifIfdGetName, type Ifd } from "libexif-wasm";

import { ExpandRows } from "#components/table/ExpandRows";
import type { Features } from "#components/table/tableFeatures";
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
        {exifIfdGetName(getValue())}
        <Badge>
          {m.wise_curly_mallard_embrace({
            count: row.getCanExpand() ? row.subRows.length : 0,
          })}
        </Badge>
      </ExpandRows>
    );
  }

  return null;
};

export { IfdCell };
