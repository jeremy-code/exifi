import { useTransition } from "react";

import { Save } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useFile } from "#contexts/FileContext";
import { isMobileWebKit } from "#utils/platform";
import { saveFile } from "#utils/saveFile";
import { setExifData } from "@exifi/core/exif/utils/setExifData";
import { Button } from "@exifi/ui/components/Button";
import { Toolbar, type ToolbarProps } from "@exifi/ui/components/Toolbar";

import { useExifEditor } from "../contexts/ExifEditorContext";
import { ExifMenu } from "./ExifMenu";
import { AddEntryDialog } from "./dialogs/AddEntryDialog";
import { AddGpsEntriesDialog } from "./dialogs/AddGpsEntriesDialog";
import { DiffDialog } from "./dialogs/DiffDialog";

type ExifToolbarProps = Omit<ToolbarProps, "children">;

const ExifToolbar = (props: ExifToolbarProps) => {
  const { file, setFile } = useFile();
  const { exifData, isDirty } = useExifEditor(
    useShallow((state) => ({
      exifData: state.exifData,
      isDirty: state.isDirty,
    })),
  );
  const [isPending, startTransition] = useTransition();

  return (
    <Toolbar aria-label="Exif editor toolbar" {...props}>
      <Button
        isDisabled={!isDirty}
        onPress={() => {
          // For an unfathomable reason, Mobile iOS specifically seems to have
          // issues with saveFile(), returning a NotReadableError "The I/O read
          // operation failed." afterwards. For more information, see
          // jeremy-code/exifi#7.
          if (isMobileWebKit()) {
            // Safari seemingly blocks asynchronous calls to window.open:
            // https://stackoverflow.com/a/39387533/18551960
            const windowProxy = window.open(undefined, "_blank");

            // https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition
            startTransition(async () => {
              const newFile = await setExifData(file, exifData);

              if (windowProxy !== null) {
                const blobUrl = URL.createObjectURL(file);
                windowProxy.location.assign(blobUrl);
                URL.revokeObjectURL(blobUrl);
              }
              startTransition(() => setFile(newFile));
            });
          } else {
            startTransition(async () => {
              const newFile = await setExifData(file, exifData);

              startTransition(() => {
                // If I move this outside of the startTransition callback, React
                // gets stuck on isPending for much longer than it should be.
                void saveFile(newFile);
                setFile(newFile);
              });
            });
          }
        }}
      >
        <Save size={16} />
        {!isDirty ? "Saved" : isPending ? "Saving..." : "Save"}
      </Button>
      <DiffDialog />
      <AddEntryDialog />
      <AddGpsEntriesDialog />
      <ExifMenu />
    </Toolbar>
  );
};

export { ExifToolbar };
