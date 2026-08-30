import { EnumSelect } from "#components/editor/EnumSelect";
import { ExifVersionInput } from "#components/editor/ExifVersionInput";
import { GpsTagVersionInput } from "#components/editor/GpsTagVersionInput";
import { RationalInput } from "#components/editor/RationalInput";
import { UserCommentSelect } from "#components/editor/UserCommentSelect";
import { UserCommentTextarea } from "#components/editor/UserCommentTextarea";
import type { AddEditor } from "#features/exif-editor/editors/add/types";
import { getEntryObjectLabel } from "@exifi/core/exif/utils/getEntryObjectLabel";
import { DateField } from "@exifi/ui/components/DateField";
import { DatePicker } from "@exifi/ui/components/DatePicker";
import { NumberField } from "@exifi/ui/components/NumberField";
import { TextAreaField } from "@exifi/ui/components/TextAreaField";
import { TimeField } from "@exifi/ui/components/TimeField";
import { Label } from "@exifi/ui/components/form/Label";
import { assertNever } from "@exifi/utils/assertNever";

type ExifEntryAddEditorFieldsProps = {
  exifAddEditor: AddEditor;
};

const ExifEntryAddEditorFields = ({
  exifAddEditor,
}: ExifEntryAddEditorFieldsProps) => {
  const label = getEntryObjectLabel(exifAddEditor.exifEntryObject);

  switch (exifAddEditor.kind) {
    case "enum":
    case "enumAscii":
      return (
        <EnumSelect
          placeholder={`Select a value for ${label}`}
          label="Value"
          aria-label={label}
          {...exifAddEditor}
        />
      );
    case "dateStamp":
      return (
        <DateField
          {...exifAddEditor}
          label="Value"
          onChange={(value) => {
            exifAddEditor.onValueChange(value ?? undefined);
          }}
        />
      );
    case "versionId":
      return (
        <>
          <Label>Value</Label>
          <GpsTagVersionInput aria-label={label} {...exifAddEditor} />
        </>
      );
    case "datetime":
      return (
        <DatePicker
          {...exifAddEditor}
          aria-label={label}
          granularity="second"
          label="Value"
          onChange={(value) => {
            exifAddEditor.onValueChange(value ?? undefined);
          }}
        />
      );
    case "timeStamp":
      return (
        <TimeField
          granularity="second"
          {...exifAddEditor}
          label="Value"
          aria-label={label}
          onChange={(value) => {
            exifAddEditor.onValueChange(value ?? undefined);
          }}
        />
      );
    case "ascii":
    case "xp":
      return (
        <TextAreaField
          label="Value"
          aria-label={label}
          {...exifAddEditor}
          onChange={(value) => exifAddEditor.onValueChange(value)}
        />
      );
    case "exifVersion":
      return (
        <>
          <Label>Value</Label>
          <ExifVersionInput
            inputProps={{ "aria-label": label }}
            {...exifAddEditor}
          />
        </>
      );
    case "rational":
      return (
        <>
          <Label>Value</Label>
          <RationalInput
            aria-label={`${label}`}
            placeholderRational={{ numerator: 0, denominator: 1 }}
            initialRational={exifAddEditor.values.at(0)}
            setRational={(rational) => exifAddEditor.onValueChange(rational, 0)}
          />
          {exifAddEditor.values.slice(1).map((value, index) => (
            <RationalInput
              // eslint-disable-next-line @eslint-react/no-array-index-key -- Index is only reasonable key
              key={index}
              aria-label={`${label} ${index + 1}`}
              initialRational={value}
              setRational={(rational) =>
                exifAddEditor.onValueChange(rational, index)
              }
            />
          ))}
        </>
      );
    case "numeric":
      return (
        <>
          <NumberField
            label="Value"
            aria-label={label}
            placeholder="0"
            value={exifAddEditor.values.at(0)}
            onChange={(value) => exifAddEditor.onValueChange(value, 0)}
          />
          {exifAddEditor.values.slice(1).map((value, index) => (
            <NumberField
              aria-label={`${label} ${index + 1}`}
              // eslint-disable-next-line @eslint-react/no-array-index-key -- Index is only reasonable key
              key={index}
              value={value}
              onChange={(value) =>
                exifAddEditor.onValueChange(value, index + 1)
              }
            />
          ))}
        </>
      );
    case "userComment":
      return (
        <div className="flex flex-col gap-2">
          <UserCommentSelect
            label="Encoding"
            aria-label="Select a value for the user comment encoding"
            {...exifAddEditor}
          />
          <UserCommentTextarea
            label="Value"
            aria-label={label}
            {...exifAddEditor}
          />
        </div>
      );
    default:
      assertNever(exifAddEditor);
  }
};

export { ExifEntryAddEditorFields };
