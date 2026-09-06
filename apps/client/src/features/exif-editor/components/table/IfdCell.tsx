import type { CellContext } from "@tanstack/react-table";
import { exifIfdGetName, type Ifd } from "libexif-wasm";
import { useLocale } from "react-aria/I18nProvider";

import { ExpandRows } from "#components/table/ExpandRows";
import { formatPlural } from "#utils/format/formatPlural";
import { Badge } from "@exifi/ui/components/Badge";

import type { ExifTableRow } from "./columns";

const IfdCell = ({ row, getValue }: CellContext<ExifTableRow, Ifd>) => {
  const { locale } = useLocale();

  if ("entries" in row.original || row.getCanExpand()) {
    return (
      <ExpandRows row={row}>
        {exifIfdGetName(getValue())}
        <Badge>
          {formatPlural(
            row.getCanExpand() ? row.subRows.length : 0,
            { one: " tag", other: " tags" },
            locale,
          )}
        </Badge>
      </ExpandRows>
    );
  }

  return null;
};

export { IfdCell };
