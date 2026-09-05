import { imageDimensionsFromStream } from "image-dimensions";
import { Ellipsis } from "lucide-react";
import type { MenuTriggerProps } from "react-aria-components/Menu";
import { useShallow } from "zustand/react/shallow";

import { useFile } from "#contexts/FileContext";
import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
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
          Fix
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
          Add image dimensions
        </MenuItem>
        <MenuItem
          onAction={async () => {
            const currentPosition = await getCurrentPosition();
            updateGeolocationPosition(exifData, currentPosition);
            updateExifDataObject();
          }}
        >
          Set Exif to current GPS position
        </MenuItem>
        <MenuItem
          onAction={() => {
            updateDateAndTimeDigitized(exifData);
            updateExifDataObject();
          }}
        >
          Set Date and Time Digitized to current time
        </MenuItem>
        <MenuItem
          onAction={() => {
            addImageUniqueId(exifData);
            updateExifDataObject();
          }}
        >
          Add Image Unique ID
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
};

export { ExifMenu };
