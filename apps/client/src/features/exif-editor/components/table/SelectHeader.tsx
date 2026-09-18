import { Subscribe, type HeaderContext } from "@tanstack/react-table";

import type { Features } from "#components/table/tableFeatures";
import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectHeader = ({ table }: HeaderContext<Features, ExifTableRow>) => {
  const preGroupedFlatRows = table.getFilteredRowModel().flatRows;

  return (
    <Subscribe
      source={table.atoms.rowSelection}
      // https://github.com/TanStack/table/blob/21d713fc4947d2a08cc2136bb055889a61412ded/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L358
      selector={(rowSelection) => {
        const selectedCount = Object.keys(rowSelection).length;

        return (
          preGroupedFlatRows.length === selectedCount ||
          (selectedCount > 0 ? "indeterminate" : false)
        );
      }}
    >
      {(state) => (
        <Checkbox
          checkboxButtonProps={{ boxProps: { className: "mx-auto" } }}
          isSelected={state === true}
          isIndeterminate={state === "indeterminate"}
          onChange={(isSelected) => {
            table.toggleAllRowsSelected(isSelected);
          }}
        />
      )}
    </Subscribe>
  );
};

export { SelectHeader };
