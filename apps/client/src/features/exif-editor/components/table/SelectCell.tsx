import type { CellContext } from "@tanstack/react-table";

import type { Features } from "#components/table/tableFeatures";
import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectCell = ({ row }: CellContext<Features, ExifTableRow>) => {
  return (
    <Checkbox
      boxProps={{ className: "mx-auto" }}
      isSelected={row.getIsSelected()}
      isIndeterminate={row.getIsSomeSelected()}
      onChange={(isSelected) => {
        row.toggleSelected(isSelected);
      }}
      // There are no subrows to select, cell is a placeholder
      isDisabled={
        "entries" in row.original && row.originalSubRows?.length === 0
      }
    />
  );
};

export { SelectCell };
