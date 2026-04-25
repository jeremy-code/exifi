import type { ExifEditorStoreActions } from "#hooks/useExifEditor";
import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { formatList } from "#utils/formatList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exifi/ui/components/Select";

const getEnumValue = (values: Record<string, number>, value: string) => {
  if (values === undefined) {
    throw new Error("Invalid tag was provided, expected enum");
  }

  if (!(value in values) || values[value] === undefined) {
    throw new Error(
      `Invalid value was provided, received ${value}, expected one of ${formatList(
        Object.keys(values),
        undefined,
        { style: "short", type: "disjunction" },
      )}`,
    );
  }

  return values[value];
};

const EnumValueCell = ({
  exifEntryObject,
  updateExifEntry,
  value,
}: {
  exifEntryObject: ExifEntryObject;
  value: string;
  updateExifEntry: ExifEditorStoreActions["updateExifEntry"];
}) => {
  if (!(exifEntryObject.tag in EXIF_TAG_MAP)) {
    throw new Error("Invalid tag was provided, expected mapped Exif tag");
  }

  const values = EXIF_TAG_MAP[exifEntryObject.tag]?.values;
  if (values === undefined) {
    throw new Error("Invalid tag was provided, expected enum");
  }

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        updateExifEntry(
          exifEntryObject,
          newTypedArrayInFormat(
            [getEnumValue(values, value)],
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
        {Object.keys(values).map((key) => (
          <SelectItem key={`${exifEntryObject.tag}-${key}`} value={key}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { EnumValueCell };
