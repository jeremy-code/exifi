import type { CellContext } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { AccessibleIcon } from "radix-ui";

import { Button } from "@exifi/ui/components/Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exifi/ui/components/Dialog";

import { ExifEntryEditor } from "../entry/ExifEntryEditor";
import type { ExifTableRow } from "../table/columns";

type EditEntryDialogProps = CellContext<ExifTableRow, unknown>;

const EditEntryDialog = ({ row }: EditEntryDialogProps) => {
  if ("entries" in row.original) {
    return null;
  }

  return (
    <Dialog>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <AccessibleIcon.Root label="Edit">
              <Pencil size="16" />
            </AccessibleIcon.Root>
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent
        aria-description="Edit Exif data dialog"
        className="overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>Edit Exif data</DialogTitle>
          <DialogDescription>
            Make changes to the Exif entry here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <ExifEntryEditor exifEntryObject={row.original} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { EditEntryDialog, type EditEntryDialogProps };
