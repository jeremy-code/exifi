import { lazy, Suspense } from "react";

import { Pencil } from "lucide-react";

import { useDialogState } from "#hooks/useDialogState";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { Button } from "@exifi/ui/components/Button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogBody,
  DialogHeader,
  DialogDescription,
} from "@exifi/ui/components/Dialog";
import { Modal } from "@exifi/ui/components/Modal";
import { Skeleton } from "@exifi/ui/components/Skeleton";

const ExifEntryInspector = lazy(() =>
  import("../entries/edit/ExifEntryInspector").then((m) => ({
    default: m.ExifEntryInspector,
  })),
);

type EditEntryDialogProps = {
  exifEntryObject: ExifEntryObject;
};

const EditEntryDialog = ({ exifEntryObject }: EditEntryDialogProps) => {
  const { isOpen, onOpenChange } = useDialogState();

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button variant="outline" size="icon" aria-label="Edit">
        <Pencil size="16" />
      </Button>
      <Modal isDismissable>
        <Dialog aria-description="Edit Exif data dialog">
          <DialogHeader>
            <DialogTitle>Edit Exif data</DialogTitle>
            <DialogDescription>
              Make changes to the Exif entry here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Suspense fallback={<Skeleton className="h-50 w-full" />}>
              <ExifEntryInspector exifEntryObject={exifEntryObject} />
            </Suspense>
          </DialogBody>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export { EditEntryDialog, type EditEntryDialogProps };
