import type { CellContext } from "@tanstack/react-table";

import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectCell = ({ row }: CellContext<ExifTableRow, unknown>) => {
  // It seems that TanStack Table (which may be incompatible with React compiler)
  // does not place nice with React Aria Checkbox.
  "use no memo";

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
