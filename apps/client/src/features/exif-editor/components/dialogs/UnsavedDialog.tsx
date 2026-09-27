import { useBlocker } from "@tanstack/react-router";

import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
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
      <Dialog role="alertdialog" aria-description="Unsaved Exif data dialog">
        <DialogHeader>
          <DialogTitle>Unsaved Exif data</DialogTitle>
          <DialogDescription>
            {
              "This page is asking you to confirm that you want to leave — information you\u2019ve entered may not be saved."
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onPress={reset}>Stay on page</Button>
          <Button variant="ghost" onPress={proceed}>
            Leave page
          </Button>
        </DialogFooter>
      </Dialog>
    </Modal>
  );
};
export { UnsavedDialog };
