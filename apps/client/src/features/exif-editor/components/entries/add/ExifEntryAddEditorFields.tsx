import { EnumSelect } from "#components/editor/EnumSelect";
import { ExifVersionInput } from "#components/editor/ExifVersionInput";
import { GpsTagVersionInput } from "#components/editor/GpsTagVersionInput";
import { RationalInput } from "#components/editor/RationalInput";
import { UserCommentEncodingSelect } from "#components/editor/UserCommentEncodingSelect";
import { UserCommentTextarea } from "#components/editor/UserCommentTextarea";
import type { AddEditor } from "#features/exif-editor/editors/add/interfaces";
import { getEntryLabel } from "#features/exif-editor/utils/getEntryLabel";
import { getExifEnumValueLabel } from "#lib/exif/labels";
import { m } from "#paraglide/messages";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { DateField } from "@exifi/ui/components/DateField";
import { DatePicker } from "@exifi/ui/components/DatePicker";
import { NumberField } from "@exifi/ui/components/NumberField";
import { TextAreaField } from "@exifi/ui/components/TextAreaField";
import { TimeField } from "@exifi/ui/components/TimeField";
import { Label } from "@exifi/ui/components/form/Label";
import { assertNever } from "@exifi/utils/assertNever";

type ExifEntryAddEditorFieldsProps = {
  exifAddEditor: AddEditor;
  exifEntryObject: Partial<ExifEntryObject>;
};

const ExifEntryAddEditorFields = ({
  exifAddEditor,
  exifEntryObject,
}: ExifEntryAddEditorFieldsProps) => {
  const label = getEntryLabel(exifEntryObject);

  switch (exifAddEditor.kind) {
    case "enum":
    case "enumAscii":
      return (
        <EnumSelect
          placeholder={m.editor_select_value_for({ label })}
          label={m.editor_field_value()}
          getLabel={(key) =>
            exifEntryObject.tag !== undefined
              ? getExifEnumValueLabel(exifEntryObject.tag, key)
              : key
          }
          aria-label={label}
          {...exifAddEditor}
        />
      );
    case "dateStamp":
      return (
        <DateField
          {...exifAddEditor}
          label={m.editor_field_value()}
          onChange={(value) => {
            if (value !== null) {
              exifAddEditor.onValueChange(value);
            }
          }}
        />
      );
    case "versionId":
      return (
        <>
          <Label>{m.editor_field_value()}</Label>
          <GpsTagVersionInput aria-label={label} {...exifAddEditor} />
        </>
      );
    case "datetime":
      return (
        <DatePicker
          {...exifAddEditor}
          aria-label={label}
          granularity="second"
          label={m.editor_field_value()}
          onChange={(value) => {
            if (value !== null) {
              exifAddEditor.onValueChange(value);
            }
          }}
        />
      );
    case "timeStamp":
      return (
        <TimeField
          granularity="second"
          {...exifAddEditor}
          label={m.editor_field_value()}
          aria-label={label}
          onChange={(value) => {
            if (value !== null) {
              exifAddEditor.onValueChange(value);
            }
          }}
        />
      );
    case "ascii":
    case "xp":
      return (
        <TextAreaField
          label={m.editor_field_value()}
          aria-label={label}
          {...exifAddEditor}
          onChange={(value) => exifAddEditor.onValueChange(value)}
        />
      );
    case "exifVersion":
      return (
        <>
          <Label>{m.editor_field_value()}</Label>
          <ExifVersionInput
            inputProps={{ "aria-label": label }}
            {...exifAddEditor}
          />
        </>
      );
    case "rational":
      return (
        <>
          <Label>{m.editor_field_value()}</Label>
          <RationalInput
            aria-label={label}
            placeholderRational={{ numerator: 0, denominator: 1 }}
            initialRational={exifAddEditor.values.at(0)}
            setRational={(rational) => exifAddEditor.onValueChange(rational, 0)}
          />
          {exifAddEditor.values.slice(1).map((value, index) => (
            <RationalInput
              key={index}
              aria-label={m.editor_entry_value_index_label({
                label,
                index: index + 1,
              })}
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
            label={m.editor_field_value()}
            aria-label={label}
            placeholder="0"
            value={exifAddEditor.values.at(0)}
            onChange={(value) => exifAddEditor.onValueChange(value, 0)}
          />
          {exifAddEditor.values.slice(1).map((value, index) => (
            <NumberField
              aria-label={m.editor_entry_value_index_label({
                label,
                index: index + 1,
              })}
              key={index}
              value={value}
              onChange={(nextValue) =>
                exifAddEditor.onValueChange(nextValue, index + 1)
              }
            />
          ))}
        </>
      );
    case "userComment":
      return (
        <div className="flex flex-col gap-2">
          <UserCommentEncodingSelect
            label={m.editor_field_encoding()}
            aria-label={m.editor_user_comment_encoding_label()}
            {...exifAddEditor}
          />
          <UserCommentTextarea
            label={m.editor_field_value()}
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
