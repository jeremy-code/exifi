import { Minus, Plus } from "lucide-react";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { Button } from "@exifi/ui/components/Button";

type ExifEntryAddEditorControlsProps = {
  exifEntryObject: Partial<ExifEntryObject> & Pick<ExifEntryObject, "value">;
  setValues: (values: number[]) => void;
};

const ExifEntryAddEditorControls = ({
  exifEntryObject,
  setValues,
}: ExifEntryAddEditorControlsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        onPress={() => {
          if (exifEntryObject.value.length === 0) {
            if (
              exifEntryObject.format === "RATIONAL" ||
              exifEntryObject.format === "SRATIONAL"
            ) {
              setValues([0, 1, 0, 1]);
            } else {
              setValues([0, 0]);
            }
          } else {
            if (
              exifEntryObject.format === "RATIONAL" ||
              exifEntryObject.format === "SRATIONAL"
            ) {
              setValues(exifEntryObject.value.concat([0, 1]));
            } else {
              setValues(exifEntryObject.value.concat([0]));
            }
          }
        }}
      >
        <Plus className="size-4" />
      </Button>
      <Button
        size="icon"
        isDisabled={exifEntryObject.value.length === 0}
        onPress={() => {
          if (
            exifEntryObject.format === "RATIONAL" ||
            exifEntryObject.format === "SRATIONAL"
          ) {
            setValues(exifEntryObject.value.slice(0, -2));
          } else {
            setValues(exifEntryObject.value.slice(0, -1));
          }
        }}
      >
        <Minus className="size-4" />
      </Button>
    </div>
  );
};

export { ExifEntryAddEditorControls };
