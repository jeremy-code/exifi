import type { ComponentPropsWithRef } from "react";

import { Plus } from "lucide-react";
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

import { ExifEntryAddForm } from "../entry/ExifEntryAddForm";

type AddEntryDialogProps = ComponentPropsWithRef<typeof Dialog>;

const AddEntryDialog = (props: AddEntryDialogProps) => {
  return (
    <Dialog {...props}>
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
          <ExifEntryAddForm />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AddEntryDialog, type AddEntryDialogProps };
