import type { CellContext } from "@tanstack/react-table";
import { exifIfdGetName, type Ifd } from "libexif-wasm";

import { ExpandRows } from "#components/table/ExpandRows";
import { formatPlural } from "#utils/formatPlural";
import { Badge } from "@exifi/ui/components/Badge";

import type { ExifTableRow } from "./columns";

const IfdCell = ({ row, getValue }: CellContext<ExifTableRow, Ifd>) => {
  if ("entries" in row.original || row.getCanExpand()) {
    return (
      <ExpandRows row={row}>
        {exifIfdGetName(getValue())}
        <Badge>
          {formatPlural(row.getCanExpand() ? row.subRows.length : 0, {
            one: " tag",
            other: " tags",
          })}
        </Badge>
      </ExpandRows>
    );
  }

  return null;
};

export { IfdCell };
