import { lazy, Suspense } from "react";

import { useShallow } from "zustand/react/shallow";

import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
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
  DialogFooter,
} from "@exifi/ui/components/Dialog";
import { Modal } from "@exifi/ui/components/Modal";
import { Skeleton } from "@exifi/ui/components/Skeleton";

type DiffDialogProps = Omit<DialogTriggerProps, "children">;

const JsonDiffViewer = lazy(() =>
  import("#components/diff/JsonDiffViewer").then((mod) => ({
    default: mod.JsonDiffViewer,
  })),
);

const DiffDialog = (props: DiffDialogProps) => {
  const { isDirty, initialExifDataObject, exifDataObject } = useExifEditor(
    useShallow((state) => ({
      isDirty: state.isDirty,
      initialExifDataObject: state.initialExifDataObject,
      exifDataObject: state.exifDataObject,
    })),
  );

  return (
    <DialogTrigger {...props}>
      <Button
        variant="outline"
        aria-label={m.editor_diff_button_label()}
        isDisabled={!isDirty}
      >
        {m.editor_diff_button()}
      </Button>

      <Modal isDismissable>
        <Dialog aria-description={m.editor_diff_dialog_description()}>
          <DialogHeader>
            <DialogTitle>{m.editor_diff_dialog_title()}</DialogTitle>
            <DialogDescription>{m.editor_diff_dialog_body()}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Suspense fallback={<Skeleton className="h-50 w-full" />}>
              <JsonDiffViewer
                oldValue={initialExifDataObject}
                newValue={exifDataObject}
              />
            </Suspense>
          </DialogBody>
          <DialogFooter closeButton></DialogFooter>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export { DiffDialog, type DiffDialogProps };
