import { useTransition } from "react";

import { parse } from "@std/path";
import { ChevronDown, Save } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useFile } from "#contexts/FileContext";
import { m } from "#paraglide/messages";
import { isMobileWebKit } from "#utils/platform";
import { saveFile } from "#utils/saveFile";
import { setExifData } from "@exifi/core/exif/utils/setExifData";
import { Button } from "@exifi/ui/components/Button";
import { Menu, MenuItem, MenuTrigger } from "@exifi/ui/components/Menu";

import { useExifEditor } from "../contexts/ExifEditorContext";

const ExifDownload = () => {
  const { file, setFile } = useFile();
  const { exifData, makerNoteEntryObject, isDirty } = useExifEditor(
    useShallow((state) => ({
      exifData: state.exifData,
      makerNoteEntryObject: state.exifDataObject.ifd.EXIF.find(
        (entry) => entry.tag === "MAKER_NOTE",
      ),
      isDirty: state.isDirty,
    })),
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex" role="group">
      <Button
        variant="surface"
        isDisabled={!isDirty}
        className="rounded-r-none border-r-0"
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
              startTransition(() => setFile(newFile ?? file));
            });
          } else {
            startTransition(async () => {
              const newFile = await setExifData(file, exifData);

              startTransition(() => {
                // If I move this outside of the startTransition callback, React
                // gets stuck on isPending for much longer than it should be.
                void saveFile(newFile ?? file);
                setFile(newFile ?? file);
              });
            });
          }
        }}
      >
        <Save size={16} />
        {!isDirty
          ? m["editor.saveSuccess"]()
          : isPending
            ? m["editor.saveLoading"]()
            : m["editor.saveSuccess"]()}
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
            {m.teary_teal_samuel_twirl()}
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
            {m.sad_left_rabbit_find()}
          </MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  );
};

export { ExifDownload };
