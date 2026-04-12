import type { CellContext } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { AccessibleIcon } from "radix-ui";

import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Button } from "@exiftools/ui/components/Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exiftools/ui/components/Dialog";

import { ExifEntryEditor } from "../-ExifEntryEditor";

const EditCell = ({ row }: CellContext<ExifEntryObject, unknown>) => {
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
      <DialogContent aria-description="Edit Exif data dialog" className="overflow-auto">
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

export { EditCell };
