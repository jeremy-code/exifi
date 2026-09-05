import type { HeaderContext } from "@tanstack/react-table";

import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectHeader = ({ table }: HeaderContext<ExifTableRow, unknown>) => {
  "use no memo";

  return (
    <Checkbox
      boxProps={{ className: "mx-auto" }}
      isSelected={table.getIsAllRowsSelected()}
      isIndeterminate={table.getIsSomeRowsSelected()}
      onChange={(isSelected) => {
        table.toggleAllRowsSelected(isSelected);
      }}
    />
  );
};

export { SelectHeader };
