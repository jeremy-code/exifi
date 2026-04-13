import type { ExifEditorStoreActions } from "#hooks/useExifEditor";
import { EXIF_TAG_VALUE_MAP } from "#lib/exif/exifTagValueMap";
import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exiftools/ui/components/Select";

const EnumValueCell = ({
  exifEntryObject,
  updateExifEntry,
  value,
}: {
  exifEntryObject: ExifEntryObject;
  value: string;
  updateExifEntry: ExifEditorStoreActions["updateExifEntry"];
}) => {
  if (!(exifEntryObject.tag in EXIF_TAG_VALUE_MAP)) {
    throw new Error("Invalid tag was provided, expected enum");
  }

  const tag = exifEntryObject.tag as keyof typeof EXIF_TAG_VALUE_MAP;
  if (!(value in EXIF_TAG_VALUE_MAP[tag])) {
    throw new Error(
      `Invalid value was provided, received ${value}, expected one of ${Object.keys(EXIF_TAG_VALUE_MAP[tag]).join()}`,
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        if (!(value in EXIF_TAG_VALUE_MAP[tag])) {
          throw new Error(
            `Invalid value was provided, received ${value}, expected one of ${Object.keys(EXIF_TAG_VALUE_MAP[tag]).join()}`,
          );
        }
        updateExifEntry(
          exifEntryObject,
          newTypedArrayInFormat(
            [
              EXIF_TAG_VALUE_MAP[tag][
                value as keyof (typeof EXIF_TAG_VALUE_MAP)[typeof tag]
              ],
            ],
            exifEntryObject.format,
          ),
        );
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={`Select a value for ${exifEntryObject.tag}`}
        />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(EXIF_TAG_VALUE_MAP[tag]).map((key) => (
          <SelectItem key={`${exifEntryObject.tag}-${key}`} value={key}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { EnumValueCell };
