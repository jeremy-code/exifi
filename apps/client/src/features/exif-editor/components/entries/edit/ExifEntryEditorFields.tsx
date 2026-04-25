import { type Dispatch, type SetStateAction } from "react";

import { NumberInput } from "#components/editor/NumberInput";
import { RationalInput } from "#components/editor/RationalInput";
import { UserCommentTextarea } from "#components/editor/UserCommentTextarea";
import { getExifAdvancedEditor } from "#features/exif-editor/editors/advanced/getExifAdvancedEditor";
import { type ExifEntryObject } from "#lib/exif/serializeExifData";
import { assertNever } from "#utils/assertNever";
import { Textarea } from "@exifi/ui/components/Textarea";

type ExifEntryEditorFieldsProps = {
  exifEntryObject: ExifEntryObject;
  draft: number[];
  setDraft: Dispatch<SetStateAction<number[]>>;
};

const ExifEntryEditorFields = ({
  exifEntryObject,
  draft,
  setDraft,
}: ExifEntryEditorFieldsProps) => {
  const exifAdvancedEditor = getExifAdvancedEditor(
    exifEntryObject,
    draft,
    setDraft,
  );

  if (exifAdvancedEditor === null) {
    return null;
  }

  switch (exifAdvancedEditor.kind) {
    case "rational":
      return exifAdvancedEditor.values.map((value, index) => (
        <RationalInput
          key={index}
          initialRational={value}
          setRational={(rational) =>
            exifAdvancedEditor.onValueChange(rational, index)
          }
        />
      ));
    case "ascii":
      return (
        <Textarea
          {...exifAdvancedEditor}
          onChange={(e) => exifAdvancedEditor.onValueChange(e.target.value)}
        />
      );
    case "numeric":
      return exifAdvancedEditor.values.map((value, index) => (
        <NumberInput
          key={index}
          value={value}
          onValueChange={(value) =>
            exifAdvancedEditor.onValueChange(value, index)
          }
        />
      ));
    case "userComment":
      return <UserCommentTextarea {...exifAdvancedEditor} />;
    default:
      assertNever(exifAdvancedEditor);
  }
};

export { ExifEntryEditorFields, type ExifEntryEditorFieldsProps };
