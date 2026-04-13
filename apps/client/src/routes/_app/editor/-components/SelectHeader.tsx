import type { HeaderContext } from "@tanstack/react-table";

import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Checkbox } from "@exiftools/ui/components/Checkbox";

const SelectHeader = ({ table }: HeaderContext<ExifEntryObject, unknown>) => {
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
