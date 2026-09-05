import { RationalInput } from "#components/editor/RationalInput";
import { UserCommentSelect } from "#components/editor/UserCommentSelect";
import { UserCommentTextarea } from "#components/editor/UserCommentTextarea";
import { useExifEntryDraftContext } from "#features/exif-editor/contexts/ExifEntryDraftContext";
import { getExifAdvancedEditor } from "#features/exif-editor/editors/advanced/getExifAdvancedEditor";
import { getEntryObjectLabel } from "#lib/exif/utils/getEntryObjectLabel";
import { NumberField } from "@exifi/ui/components/NumberField";
import { TextAreaField } from "@exifi/ui/components/TextAreaField";
import { assertNever } from "@exifi/utils/assertNever";

const ExifEntryEditor = () => {
  const { exifEntryObject, draft, setDraft } = useExifEntryDraftContext();
  const exifAdvancedEditor = getExifAdvancedEditor(
    { ...exifEntryObject, value: draft },
    setDraft,
  );

  if (exifAdvancedEditor === null) {
    return null;
  }
  const label = getEntryObjectLabel(exifEntryObject);

  switch (exifAdvancedEditor.kind) {
    case "rational":
      return exifAdvancedEditor.values.map((value, index) => (
        <RationalInput
          key={index}
          aria-label={`${label} ${index + 1}`}
          initialRational={value}
          setRational={(rational) =>
            exifAdvancedEditor.onValueChange(rational, index)
          }
        />
      ));
    case "ascii":
    case "xp":
      return (
        <TextAreaField
          aria-label={label}
          {...exifAdvancedEditor}
          onChange={(target) => exifAdvancedEditor.onValueChange(target)}
        />
      );
    case "numeric":
      return exifAdvancedEditor.values.map((value, index) => (
        <NumberField
          aria-label={`${label} ${index + 1}`}
          key={index}
          value={value}
          onChange={(value) => exifAdvancedEditor.onValueChange(value, index)}
        />
      ));
    case "userComment":
      return (
        <div className="flex flex-col gap-2">
          <UserCommentSelect aria-label={label} {...exifAdvancedEditor} />
          <UserCommentTextarea aria-label={label} {...exifAdvancedEditor} />
        </div>
      );
    default:
      assertNever(exifAdvancedEditor);
  }
};

export { ExifEntryEditor };
