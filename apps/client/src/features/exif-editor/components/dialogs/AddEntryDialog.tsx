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
        aria-label={m.editor_add_entry_button_label()}
      >
        <Plus size="16" />
      </Button>

      <Modal>
        <Dialog aria-description={m.editor_add_entry_dialog_description()}>
          <DialogHeader>
            <DialogTitle>{m.editor_add_entry_dialog_title()}</DialogTitle>
            <DialogDescription>
              {m.editor_add_entry_dialog_body()}
            </DialogDescription>
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
