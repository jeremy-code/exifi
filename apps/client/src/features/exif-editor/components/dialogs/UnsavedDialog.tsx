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
        aria-description={m.extra_vexed_starfish_mend()}
      >
        <DialogHeader>
          <DialogTitle>{m.extra_vexed_starfish_mend()}</DialogTitle>
          <DialogDescription>
            {m.male_slimy_antelope_expand()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onPress={reset}>{m.minor_wide_alligator_find()}</Button>
          <Button onPress={proceed}>{m.tense_green_ant_find()}</Button>
        </DialogFooter>
      </Dialog>
    </Modal>
  );
};
export { UnsavedDialog };
