import type { CellContext } from "@tanstack/react-table";

import { EditEntryDialog } from "../dialogs/EditEntryDialog";
import type { ExifTableRow } from "./columns";

type EditEntryCellProps = CellContext<ExifTableRow, unknown>;

const EditCell = ({ row }: EditEntryCellProps) => {
  if ("entries" in row.original) {
    return null;
  }

  return <EditEntryDialog exifEntryObject={row.original} />;
};

export { EditCell };
