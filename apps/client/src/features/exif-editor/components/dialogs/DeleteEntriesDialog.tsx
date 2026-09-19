import { Trash2 } from "lucide-react";
import { useLocale } from "react-aria/I18nProvider";

import { m } from "#paraglide/messages";
import { formatPlural } from "#utils/formatPlural";
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
  const { locale } = useLocale();

  return (
    <DialogTrigger {...props}>
      <Button>
        <Trash2 size={16} />
        {m["common.delete"]()}
      </Button>
      <Modal
        aria-description="Delete Exif entries alert dialog"
        modalProps={{
          className: "max-w-[min(calc(100%-2rem),--spacing(140))]",
        }}
      >
        <Dialog role="alertdialog">
          <DialogHeader>
            <DialogTitle>{m.lower_watery_oryx_pride()}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {`This action will delete ${formatPlural(
              rows.length,
              { one: " Exif entry", other: " Exif entries" },
              locale,
            )}`}
          </DialogBody>
          <DialogFooter closeButton>
            <Button onPress={() => deleteRows()} className="ml-3">
              {m["common.delete"]()}
            </Button>
          </DialogFooter>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export { DeleteEntriesDialog, type DeleteEntriesDialogProps };
