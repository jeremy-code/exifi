import type { DistributedPick } from "type-fest";

import { getExifAddEditor } from "#features/exif-editor/editors/add/getExifAddEditor";
import { m } from "#paraglide/messages";
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
        placeholder={m.editor_add_value_placeholder()}
        label={m.editor_field_value()}
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
      m.editor_add_error_no_editor({
        tag: exifEntryObject.tag ?? m.editor_add_error_empty_tag(),
      }),
    );
  }

  return (
    <>
      <ExifEntryAddEditorFields
        exifAddEditor={exifAddEditor}
        exifEntryObject={exifEntryObject}
      />
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
