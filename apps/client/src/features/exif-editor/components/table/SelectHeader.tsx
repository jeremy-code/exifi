import type { HeaderContext } from "@tanstack/react-table";

import type { Features } from "#components/table/tableFeatures";
import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectHeader = ({ table }: HeaderContext<Features, ExifTableRow>) => {
  return (
    <Checkbox
      boxProps={{ className: "mx-auto" }}
      isSelected={table.getIsAllRowsSelected()}
      isIndeterminate={
        table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
      }
      onChange={(isSelected) => {
        table.toggleAllRowsSelected(isSelected);
      }}
    />
  );
};

export { SelectHeader };
