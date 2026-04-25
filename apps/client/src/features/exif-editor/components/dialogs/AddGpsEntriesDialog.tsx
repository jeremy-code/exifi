import type { ComponentPropsWithRef } from "react";

import { MapPin } from "lucide-react";
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

import { ExifEntryAddGpsForm } from "../entries/add/ExifEntryAddGpsForm";

type AddGpsEntriesDialogProps = ComponentPropsWithRef<typeof Dialog>;

const AddGpsEntriesDialog = (props: AddGpsEntriesDialogProps) => {
  return (
    <Dialog {...props}>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <AccessibleIcon.Root label="Edit">
              <MapPin size="16" />
            </AccessibleIcon.Root>
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent
        aria-description="Add GPS Exif entries dialog"
        className="overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>Add GPS Exif entries</DialogTitle>
          <DialogDescription>
            Add GPS Exif entries here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="isolation-auto">
          <ExifEntryAddGpsForm />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AddGpsEntriesDialog, type AddGpsEntriesDialogProps };
