import type { CellContext } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { AccessibleIcon } from "radix-ui";

import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Button } from "@exifi/ui/components/Button";

type DeleteCellProps = CellContext<ExifEntryObject, unknown>;

const DeleteCell = ({ row, table }: DeleteCellProps) => {
  return (
    <Button
      size="icon"
      onClick={() => {
        table.options.meta?.removeExifEntry(row.original);
      }}
    >
      <AccessibleIcon.Root label="Delete">
        <Trash2 size="16" />
      </AccessibleIcon.Root>
    </Button>
  );
};

export { DeleteCell, type DeleteCellProps };
