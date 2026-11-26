import { useCallback, useState } from "react";

import { useBlocker } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

import { m } from "#paraglide/messages";
import { useDialogBlockerStore } from "#stores/dialogBlockerStore";
import { toastQueue } from "@exifi/ui/components/Toast";

const useDialogState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDialogBlocked, setIsDialogBlocked } = useDialogBlockerStore(
    useShallow((state) => ({
      isDialogBlocked: state.isDialogBlocked,
      setIsDialogBlocked: state.setIsDialogBlocked,
    })),
  );
  useBlocker({
    shouldBlockFn: () => isDialogBlocked,
    enableBeforeUnload: () => isDialogBlocked,
    withResolver: false,
  });

  const onOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      if (isDialogBlocked) {
        setIsDialogBlocked(false);
        if (!nextIsOpen) {
          toastQueue.add({
            title: m.files_dialog_unsaved_changes_title(),
            description: m.files_dialog_unsaved_changes_description(),
            toastProps: { color: "red" },
          });
        }
      } else {
        if (!nextIsOpen) {
          setIsDialogBlocked(false);
        }
        setIsOpen(nextIsOpen);
      }
    },
    [isDialogBlocked, setIsDialogBlocked],
  );

  return { isOpen, onOpenChange };
};

export { useDialogState };
