import type { HeaderContext } from "@tanstack/react-table";

import { Checkbox } from "@exifi/ui/components/Checkbox";

import type { ExifTableRow } from "./columns";

const SelectHeader = ({ table }: HeaderContext<ExifTableRow, unknown>) => {
  const checked =
    table.getIsAllRowsSelected() ? true
    : table.getIsSomeRowsSelected() ? "indeterminate"
    : false;

  return (
    <Checkbox
      className="mx-auto border-border bg-subtle"
      checked={checked}
      onCheckedChange={(checked) => {
        if (typeof checked === "boolean") {
          table.toggleAllRowsSelected(checked);
        }
      }}
    />
  );
};

export { SelectHeader };
