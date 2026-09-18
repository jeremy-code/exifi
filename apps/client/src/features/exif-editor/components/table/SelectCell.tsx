import type { CellContext } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";

import type { Features } from "#components/table/tableFeatures";
import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectCell = ({ row }: CellContext<Features, ExifTableRow>) => {
  return (
    <Subscribe
      source={row.table.atoms.rowSelection}
      selector={(rowSelection) =>
        rowSelection[row.id] &&
        row.subRows.every((subRow) => rowSelection[subRow.id])
          ? true
          : row.subRows.length !== 0 &&
              row.subRows.some((subRow) => rowSelection[subRow.id])
            ? "indeterminate"
            : false
      }
    >
      {(state) => (
        <Checkbox
          checkboxButtonProps={{ boxProps: { className: "mx-auto" } }}
          isSelected={state === true}
          isIndeterminate={state === "indeterminate"}
          onChange={(isSelected) => {
            row.toggleSelected(isSelected);
          }}
          // There are no subrows to select, cell is a placeholder
          isDisabled={
            "entries" in row.original && row.originalSubRows?.length === 0
          }
        />
      )}
    </Subscribe>
  );
};

export { SelectCell };
