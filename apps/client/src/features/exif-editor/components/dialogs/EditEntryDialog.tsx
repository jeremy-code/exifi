import { lazy, Suspense } from "react";

import { Pencil } from "lucide-react";

import { useDialogState } from "#hooks/useDialogState";
import { m } from "#paraglide/messages";
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
  import("../entries/edit/ExifEntryInspector").then((mod) => ({
    default: mod.ExifEntryInspector,
  })),
);

type EditEntryDialogProps = {
  exifEntryObject: ExifEntryObject;
};

const EditEntryDialog = ({ exifEntryObject }: EditEntryDialogProps) => {
  const { isOpen, onOpenChange } = useDialogState();

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button
        variant="outline"
        size="icon"
        aria-label={m.best_slow_lobster_dream()}
      >
        <Pencil size="16" />
      </Button>
      <Modal isDismissable>
        <Dialog aria-description={m.best_slow_lobster_dream()}>
          <DialogHeader>
            <DialogTitle>{m.best_slow_lobster_dream()}</DialogTitle>
            <DialogDescription>{m.keen_each_octopus_vent()}</DialogDescription>
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
