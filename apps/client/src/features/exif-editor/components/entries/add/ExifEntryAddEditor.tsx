import type { DistributedPick } from "type-fest";

import { getExifAddEditor } from "#features/exif-editor/editors/add/getExifAddEditor";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { TextAreaField } from "@exifi/ui/components/TextAreaField";

import { ExifEntryAddEditorControls } from "./ExifEntryAddEditorControls";
import { ExifEntryAddEditorFields } from "./ExifEntryAddEditorFields";

type ExifEntryAddEditorProps = {
  exifEntryObject: Partial<ExifEntryObject> &
    (
      | DistributedPick<ExifEntryObject, "format" | "value">
      | { format?: undefined; value: string }
    );
  onValueChange: (value: ExifEntryObject["value"]) => void;
};

const ExifEntryAddEditor = ({
  exifEntryObject,
  onValueChange,
}: ExifEntryAddEditorProps) => {
  // If format is undefined, assume the intended value is a string
  if (exifEntryObject.format === undefined) {
    return (
      <TextAreaField
        placeholder="Enter a value"
        label="Value"
        value={exifEntryObject.value}
        onChange={(value) => onValueChange(value)}
      />
    );
  }

  const exifAddEditor = getExifAddEditor(exifEntryObject, (value) =>
    onValueChange(value),
  );

  if (exifAddEditor === null) {
    throw new Error(
      `A valid Exif Editor for adding this entry (${exifEntryObject.tag ?? "*empty*"}) was not found.`,
    );
  }

  return (
    <>
      <ExifEntryAddEditorFields exifAddEditor={exifAddEditor} />
      {!!exifAddEditor.hasIndeterminateSize && (
        <ExifEntryAddEditorControls
          exifEntryObject={exifEntryObject}
          setValues={onValueChange}
        />
      )}
    </>
  );
};

export { ExifEntryAddEditor };
