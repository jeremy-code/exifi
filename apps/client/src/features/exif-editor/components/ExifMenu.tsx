import { imageDimensionsFromStream } from "image-dimensions";
import { Ellipsis } from "lucide-react";
import type { MenuTriggerProps } from "react-aria-components/Menu";
import { useShallow } from "zustand/react/shallow";

import { useFile } from "#contexts/FileContext";
import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
import { m } from "#paraglide/messages";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { addImageUniqueId } from "@exifi/core/exif/actions/addImageUniqueId";
import { updateDateAndTimeDigitized } from "@exifi/core/exif/actions/updateDateAndTimeDigitized";
import { updateGeolocationPosition } from "@exifi/core/exif/actions/updateGeolocationPosition";
import { updatePixelDimensions } from "@exifi/core/exif/actions/updatePixelDimensions";
import { Button } from "@exifi/ui/components/Button";
import { Menu, MenuItem, MenuTrigger } from "@exifi/ui/components/Menu";

type ExifMenuProps = Omit<MenuTriggerProps, "children">;

const ExifMenu = (props: ExifMenuProps) => {
  const { file } = useFile();
  const [exifData, updateExifDataObject] = useExifEditor(
    useShallow((state) => [state.exifData, state.updateExifDataObject]),
  );

  return (
    <MenuTrigger {...props}>
      <Button aria-label="Actions" size="icon" variant="outline">
        <Ellipsis className="size-4" />
      </Button>
      <Menu>
        <MenuItem
          onAction={() => {
            exifData.fix();
            updateExifDataObject();
          }}
        >
          {m.slimy_key_albatross_succeed()}
        </MenuItem>
        <MenuItem
          onAction={async () => {
            const imageDimensions = await imageDimensionsFromStream(
              file.stream(),
            );

            if (imageDimensions === undefined) {
              console.warn("Failed to get image dimensions");
              return;
            }
            updatePixelDimensions(exifData, imageDimensions);
            updateExifDataObject();
          }}
        >
          {m.front_level_lionfish_stab()}
        </MenuItem>
        <MenuItem
          onAction={async () => {
            const currentPosition = await getCurrentPosition();
            updateGeolocationPosition(exifData, currentPosition);
            updateExifDataObject();
          }}
        >
          {m.key_soft_swallow_jest()}
        </MenuItem>
        <MenuItem
          onAction={() => {
            updateDateAndTimeDigitized(exifData);
            updateExifDataObject();
          }}
        >
          {m.short_giant_myna_snip()}
        </MenuItem>
        <MenuItem
          onAction={() => {
            addImageUniqueId(exifData);
            updateExifDataObject();
          }}
        >
          {m.late_teary_myna_sway()}
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
};

export { ExifMenu };
