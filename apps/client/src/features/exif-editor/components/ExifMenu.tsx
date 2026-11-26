import { imageDimensionsFromStream } from "image-dimensions";
import { Ellipsis } from "lucide-react";
import type { MenuTriggerProps } from "react-aria-components/Menu";

import { useFile } from "#contexts/FileContext";
import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
import { m } from "#paraglide/messages";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { addImageUniqueId } from "@exifi/core/exif/actions/addImageUniqueId";
import { updateDateAndTimeDigitized } from "@exifi/core/exif/actions/updateDateAndTimeDigitized";
import { updateGeolocationPosition } from "@exifi/core/exif/actions/updateGeolocationPosition";
import { updatePixelDimensions } from "@exifi/core/exif/actions/updatePixelDimensions";
import { resizeImage } from "@exifi/core/image/resizeImage";
import { Button } from "@exifi/ui/components/Button";
import { Menu, MenuItem, MenuTrigger } from "@exifi/ui/components/Menu";
import { toastQueue } from "@exifi/ui/components/Toast";

type ExifMenuProps = Omit<MenuTriggerProps, "children">;

const ExifMenu = (props: ExifMenuProps) => {
  const { file } = useFile();
  const act = useExifEditor((state) => state.act);

  return (
    <MenuTrigger {...props}>
      <Button aria-label={m.editor_actions()} size="icon" variant="outline">
        <Ellipsis className="size-4" />
      </Button>
      <Menu>
        <MenuItem onAction={() => act((exifData) => exifData.fix())}>
          {m.editor_menu_fix()}
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
            act((exifData) => updatePixelDimensions(exifData, imageDimensions));
          }}
        >
          {m.editor_menu_add_image_dimensions()}
        </MenuItem>
        <MenuItem
          onAction={async () => {
            const currentPosition = await getCurrentPosition();
            act((exifData) =>
              updateGeolocationPosition(exifData, currentPosition),
            );
          }}
        >
          {m.editor_menu_set_gps_position()}
        </MenuItem>
        <MenuItem
          onAction={() =>
            act((exifData) => updateDateAndTimeDigitized(exifData))
          }
        >
          {m.editor_menu_set_date_time_digitized()}
        </MenuItem>
        <MenuItem
          onAction={() => act((exifData) => addImageUniqueId(exifData))}
        >
          {m.editor_menu_add_unique_id()}
        </MenuItem>
        <MenuItem
          onAction={async () => {
            try {
              const thumbnail = await resizeImage(file, {
                width: 160,
                height: 120,
              }).then((blob) => blob.bytes());
              act((exifData) => {
                if (exifData.data.length > 0) {
                  toastQueue.add(
                    {
                      title: m.editor_toast_thumbnail_exists_title(),
                      description:
                        m.editor_toast_thumbnail_exists_description(),
                      toastProps: { color: "gray", variant: "surface" },
                    },
                    { timeout: 5_000 /* 5 seconds */ },
                  );
                }
                exifData.data = thumbnail;
              });
            } catch (e) {
              toastQueue.add(
                {
                  title: m.editor_toast_thumbnail_failed_title(),
                  description: e instanceof Error ? e.message : undefined,
                  toastProps: { color: "red" },
                },
                { timeout: 5_000 /* 5 seconds */ },
              );
            }
          }}
        >
          {m.editor_menu_add_thumbnail()}
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
};

export { ExifMenu };
