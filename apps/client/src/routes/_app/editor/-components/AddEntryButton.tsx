import { Plus } from "lucide-react";
import { AccessibleIcon } from "radix-ui";

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

import { ExifEntryAdd } from "../-ExifEntryAdd";

const AddEntryButton = () => {
  return (
    <Dialog>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <AccessibleIcon.Root label="Edit">
              <Plus size="16" />
            </AccessibleIcon.Root>
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent
        aria-description="Add Exif entry dialog"
        className="overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>Add Exif entry</DialogTitle>
          <DialogDescription>
            Add an Exif entry here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="isolation-auto">
          <ExifEntryAdd />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AddEntryButton };
