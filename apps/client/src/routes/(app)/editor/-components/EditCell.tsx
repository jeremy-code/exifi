import type { CellContext } from "@tanstack/react-table";

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

import type { ValueCellProps } from "./ValueCell";
import { ExifEntryEditor } from "../-ExifEntryEditor";

type EditCellProps = CellContext<ExifEntryObject, unknown>;

const EditCell = ({ row }: ValueCellProps) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <ExifEntryEditor exifEntryObject={row.original} />
          </DialogBody>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export { EditCell, type EditCellProps };
