import { lazy, Suspense } from "react";

import { MapPin } from "lucide-react";

import { useDialogState } from "#hooks/useDialogState";
import { m } from "#paraglide/messages";
import { Button } from "@exifi/ui/components/Button";
import {
  Dialog,
  DialogTrigger,
  type DialogTriggerProps,
  DialogTitle,
  DialogBody,
  DialogHeader,
  DialogDescription,
} from "@exifi/ui/components/Dialog";
import { Modal } from "@exifi/ui/components/Modal";
import { Skeleton } from "@exifi/ui/components/Skeleton";

type AddGpsEntriesDialogProps = Omit<DialogTriggerProps, "children">;

const ExifEntryAddGpsForm = lazy(() =>
  import("../entries/add/ExifEntryAddGpsForm").then((mod) => ({
    default: mod.ExifEntryAddGpsForm,
  })),
);

const AddGpsEntriesDialog = (props: AddGpsEntriesDialogProps) => {
  const { isOpen, onOpenChange } = useDialogState();

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      <Button variant="outline" size="icon" aria-label="Add GPS entries">
        <MapPin size="16" />
      </Button>
      <Modal isDismissable>
        <Dialog aria-description={m.blue_only_mule_fall()}>
          <DialogHeader>
            <DialogTitle>{m.blue_only_mule_fall()}</DialogTitle>
            <DialogDescription>{m.best_legal_shell_enrich()}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Suspense fallback={<Skeleton className="h-50 w-full" />}>
              <ExifEntryAddGpsForm />
            </Suspense>
          </DialogBody>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export { AddGpsEntriesDialog, type AddGpsEntriesDialogProps };
