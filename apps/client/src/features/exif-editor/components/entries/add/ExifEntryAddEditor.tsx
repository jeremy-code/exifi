import { getExifAddEditor } from "#features/exif-editor/editors/add/getExifAddEditor";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { TextAreaField } from "@exifi/ui/components/TextAreaField";
import { decodeStringFromUtf8 } from "@exifi/utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import { ExifEntryAddEditorControls } from "./ExifEntryAddEditorControls";
import { ExifEntryAddEditorFields } from "./ExifEntryAddEditorFields";

type ExifEntryAddEditorProps = {
  exifEntryObject: Partial<ExifEntryObject> & Pick<ExifEntryObject, "value">;
  onValueChange: (value: number[]) => void;
};

const ExifEntryAddEditor = ({
  exifEntryObject,
  onValueChange,
}: ExifEntryAddEditorProps) => {
  const exifAddEditor = getExifAddEditor(exifEntryObject, (value) =>
    onValueChange(value),
  );

  if (exifAddEditor === null) {
    return (
      <TextAreaField
        placeholder="Enter a value"
        label="Value"
        value={
          exifEntryObject.value !== undefined
            ? decodeStringFromUtf8(new Uint8Array(exifEntryObject.value))
            : ""
        }
        onChange={(value) => {
          onValueChange(Array.from(encodeStringToUtf8(value)));
        }}
      />
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
