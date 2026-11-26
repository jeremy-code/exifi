import { Minus, Plus } from "lucide-react";

import { m } from "#paraglide/messages";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { Button } from "@exifi/ui/components/Button";

type ExifEntryAddEditorControlsProps = {
  exifEntryObject: Partial<ExifEntryObject> & Pick<ExifEntryObject, "value">;
  setValues: (values: ExifEntryObject["value"]) => void;
};

const ExifEntryAddEditorControls = ({
  exifEntryObject,
  setValues,
}: ExifEntryAddEditorControlsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        aria-label={m.editor_byte_editor_add_component()}
        onPress={() => {
          // If length is zero, then there is already one (uncontrolled) input.
          // Hence, if the user wants to add another input, add two new inputs
          // (both controlled)
          if (exifEntryObject.value.length === 0) {
            if (
              exifEntryObject.format === "RATIONAL" ||
              exifEntryObject.format === "SRATIONAL"
            ) {
              setValues([
                { numerator: 0, denominator: 1 },
                { numerator: 0, denominator: 1 },
              ]);
            } else {
              setValues([0, 0]);
            }
          } else {
            if (
              exifEntryObject.format === "RATIONAL" ||
              exifEntryObject.format === "SRATIONAL"
            ) {
              setValues(
                exifEntryObject.value.concat([
                  { numerator: 0, denominator: 1 },
                ]),
              );
            } else {
              setValues((exifEntryObject.value as number[]).concat([0]));
            }
          }
        }}
      >
        <Plus className="size-4" />
      </Button>
      <Button
        size="icon"
        aria-label={m.editor_byte_editor_remove_component()}
        isDisabled={exifEntryObject.value.length === 0}
        onPress={() => {
          setValues(exifEntryObject.value.slice(0, -1));
        }}
      >
        <Minus className="size-4" />
      </Button>
    </div>
  );
};

export { ExifEntryAddEditorControls };
