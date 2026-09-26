import { useState, startTransition } from "react";

import { parse } from "@std/path";
import { ChevronDown, Save } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useFile } from "#contexts/FileContext";
import { isMobileWebKit } from "#utils/platform";
import { saveFile } from "#utils/saveFile";
import { setExifData } from "@exifi/core/exif/utils/setExifData";
import { Button } from "@exifi/ui/components/Button";
import { Menu, MenuItem, MenuTrigger } from "@exifi/ui/components/Menu";

import { useExifEditor } from "../contexts/ExifEditorContext";

const ExifDownload = () => {
  const { file, setFile } = useFile();
  const { exifData, makerNoteEntryObject, thumbnail, isDirty } = useExifEditor(
    useShallow((state) => ({
      exifData: state.exifData,
      makerNoteEntryObject: state.exifDataObject.ifd.EXIF.find(
        (entry) => entry.tag === "MAKER_NOTE",
      ),
      thumbnail:
        state.exifDataObject.data.length !== 0
          ? state.exifDataObject.data
          : undefined,
      isDirty: state.isDirty,
    })),
  );
  // Using state to store pending state instead of useTransition because
  // Chrome's Save dialog occludes the browser window, resulting in transitions
  // failing to update correctly due to being deprioritized
  // https://chromeenterprise.google/policies/window-occlusion-enabled/
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Immediately update file
    const newFilePromise = setExifData(file, exifData).then((newFile) => {
      startTransition(() => setFile(newFile ?? file));
      return newFile;
    });

    // For an unfathomable reason, Mobile iOS specifically seems to have
    // issues with saveFile(), returning a NotReadableError "The I/O read
    // operation failed." afterwards. For more information, see
    // jeremy-code/exifi#7.
    if (isMobileWebKit()) {
      // Safari seemingly blocks asynchronous calls to window.open:
      // https://stackoverflow.com/a/39387533/18551960
      const windowProxy = window.open(undefined, "_blank");
      if (windowProxy !== null) {
        void newFilePromise
          .then((newFile) => {
            const blobUrl = URL.createObjectURL(newFile ?? file);
            windowProxy.location.assign(blobUrl);
            URL.revokeObjectURL(blobUrl);
            return;
          })
          .catch((e) =>
            console.error(
              "An error occurred while saving the file on iOS Safari: ",
              e,
            ),
          )
          .finally(() => setIsSaving(false));
      }
    } else {
      void newFilePromise
        .then((newFile) => saveFile(newFile ?? file))
        .catch((e) =>
          console.error("An error occurred while saving the file: ", e),
        )
        .finally(() => setIsSaving(false));
    }
  };

  return (
    <div className="flex" role="group">
      <Button
        variant="surface"
        isDisabled={!isDirty}
        className="rounded-r-none border-r-0"
        onPress={() => handleSave()}
      >
        <Save className="size-4" />
        {!isDirty ? "Saved" : isSaving ? "Saving..." : "Save"}
      </Button>
      <MenuTrigger
        // @ts-expect-error -- Not sure why TypeScript can't find the right types
        placement="bottom right"
      >
        <Button
          className="rounded-l-none"
          aria-label="Actions"
          size="icon"
          variant="surface"
        >
          <ChevronDown className="size-4" />
        </Button>
        <Menu>
          <MenuItem
            onAction={() => {
              const exifDataFile = new File(
                // ExifTool .exif files exclude Exif header
                [exifData.saveData().slice("Exif\0\0".length)],
                parse(file.name).name + ".exif",
              );
              void saveFile(exifDataFile);
            }}
          >
            Download Exif data
          </MenuItem>
          <MenuItem
            isDisabled={makerNoteEntryObject === undefined}
            onAction={() => {
              if (makerNoteEntryObject !== undefined) {
                const makerNoteFile = new File(
                  [new Uint8Array(makerNoteEntryObject.data)],
                  parse(file.name).name + "_mnote.bin",
                );

                void saveFile(makerNoteFile);
              }
            }}
          >
            Download MakerNote data
          </MenuItem>
          <MenuItem
            isDisabled={thumbnail === undefined}
            onAction={() => {
              if (thumbnail !== undefined) {
                const thumbnailFile = new File(
                  [new Uint8Array(thumbnail)],
                  parse(file.name).name + "_thumb.jpeg",
                );

                void saveFile(thumbnailFile);
              }
            }}
          >
            Download thumbnail
          </MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  );
};

export { ExifDownload };
