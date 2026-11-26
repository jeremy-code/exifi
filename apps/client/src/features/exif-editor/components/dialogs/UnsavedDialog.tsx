import { useBlocker } from "@tanstack/react-router";

import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
import { m } from "#paraglide/messages";
import { Button } from "@exifi/ui/components/Button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@exifi/ui/components/Dialog";
import { Modal } from "@exifi/ui/components/Modal";

const UnsavedDialog = () => {
  const isDirty = useExifEditor((state) => state.isDirty);
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: () => isDirty,
  });

  return (
    <Modal
      isOpen={status === "blocked"}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset?.();
        }
      }}
      modalProps={{
        className:
          "max-w-[min(calc(var(--visual-viewport-width)-2rem),--spacing(100))]",
      }}
    >
      <Dialog
        role="alertdialog"
        aria-description={m.editor_unsaved_dialog_description()}
      >
        <DialogHeader>
          <DialogTitle>{m.editor_unsaved_dialog_title()}</DialogTitle>
          <DialogDescription>
            {m.editor_unsaved_dialog_body()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onPress={reset}>{m.editor_unsaved_stay()}</Button>
          <Button variant="ghost" onPress={proceed}>
            {m.editor_unsaved_leave()}
          </Button>
        </DialogFooter>
      </Dialog>
    </Modal>
  );
};
export { UnsavedDialog };
