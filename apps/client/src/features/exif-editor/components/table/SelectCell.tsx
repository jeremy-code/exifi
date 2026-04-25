import type { CellContext } from "@tanstack/react-table";

import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectCell = ({ row }: CellContext<ExifTableRow, unknown>) => {
  const checked =
    row.getIsSelected() ? true
    : row.getIsSomeSelected() ? "indeterminate"
    : false;

  return (
    <Checkbox
      className="mx-auto"
      checked={checked}
      onCheckedChange={(checked) => {
        if (typeof checked === "boolean") {
          row.toggleSelected(checked);
        }
      }}
    />
  );
};

export { SelectCell };
