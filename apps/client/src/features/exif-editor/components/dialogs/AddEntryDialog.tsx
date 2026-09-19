import { lazy, Suspense } from "react";

import { Plus } from "lucide-react";

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

type AddEntryDialogProps = Omit<DialogTriggerProps, "children">;

const ExifEntryAddForm = lazy(() =>
  import("../entries/add/ExifEntryAddForm").then((mod) => ({
    default: mod.ExifEntryAddForm,
  })),
);

const AddEntryDialog = (props: AddEntryDialogProps) => {
  const { isOpen, onOpenChange } = useDialogState();

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      <Button
        variant="outline"
        size="icon"
        aria-label={m.clear_ideal_midge_feast()}
      >
        <Plus size="16" />
      </Button>

      <Modal>
        <Dialog aria-description={m.clear_ideal_midge_feast()}>
          <DialogHeader>
            <DialogTitle>{m.clear_ideal_midge_feast()}</DialogTitle>
            <DialogDescription>{m.nice_ago_vole_swim()}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Suspense fallback={<Skeleton className="h-50 w-full" />}>
              <ExifEntryAddForm />
            </Suspense>
          </DialogBody>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export { AddEntryDialog, type AddEntryDialogProps };
