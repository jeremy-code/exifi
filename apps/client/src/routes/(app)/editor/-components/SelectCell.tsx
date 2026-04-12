import type { CellContext } from "@tanstack/react-table";

import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Checkbox } from "@exiftools/ui/components/Checkbox";

const SelectCell = ({ row }: CellContext<ExifEntryObject, unknown>) => {
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
