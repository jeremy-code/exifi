import { Trash2 } from "lucide-react";

import { m } from "#paraglide/messages";
import { Button } from "@exifi/ui/components/Button";
import {
  Dialog,
  DialogTrigger,
  type DialogTriggerProps,
  DialogTitle,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@exifi/ui/components/Dialog";
import { Modal } from "@exifi/ui/components/Modal";

type DeleteEntriesDialogProps = {
  rows: string[];
  deleteRows: () => void;
} & Omit<DialogTriggerProps, "children">;

const DeleteEntriesDialog = ({
  rows,
  deleteRows,
  ...props
}: DeleteEntriesDialogProps) => {
  return (
    <DialogTrigger {...props}>
      <Button aria-label={m.editor_delete_button_label()}>
        <Trash2 className="size-4" />
        {m.editor_delete_button()}
      </Button>
      <Modal
        aria-description={m.editor_delete_dialog_description()}
        modalProps={{
          className: "max-w-[min(calc(100%-2rem),--spacing(140))]",
        }}
      >
        <Dialog role="alertdialog">
          <DialogHeader>
            <DialogTitle>{m.editor_delete_dialog_title()}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {m.editor_delete_dialog_body({ count: rows.length })}
          </DialogBody>
          <DialogFooter closeButton>
            <Button onPress={() => deleteRows()} className="ml-3">
              {m.editor_delete_button()}
            </Button>
          </DialogFooter>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export { DeleteEntriesDialog, type DeleteEntriesDialogProps };
