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
      <Button variant="outline" aria-label="View diff" isDisabled={!isDirty}>
        {m.wacky_aloof_rooster_nourish()}
      </Button>

      <Modal isDismissable>
        <Dialog aria-description={m.mad_soft_duck_persist()}>
          <DialogHeader>
            <DialogTitle>{m.mad_soft_duck_persist()}</DialogTitle>
            <DialogDescription>{m.super_away_robin_boil()}</DialogDescription>
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
