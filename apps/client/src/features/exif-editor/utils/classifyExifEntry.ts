import type { Dayjs } from "dayjs";
import { mapRationalFromObject, type ValidTypedArray } from "libexif-wasm";

import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { dayjs } from "#utils/date";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

type BaseCtx<T> = {
  exifEntryObject: ExifEntryObject;
  value: T;
  onValueChange: (value: T) => void;
};

const EXIF_TIMESTAMP_FORMAT = "YYYY:MM:DD HH:mm:ss";
const EXIF_DATESTAMP_FORMAT = "YYYY:MM:DD";

type ExifInputKind =
  | { kind: "enum"; ctx: BaseCtx<string> & { values: string[] } }
  | { kind: "enumAscii"; ctx: BaseCtx<string> & { values: string[] } }
  | { kind: "dateStamp"; ctx: BaseCtx<Dayjs> }
  | { kind: "versionId"; ctx: BaseCtx<number[]> }
  | { kind: "datetime"; ctx: BaseCtx<Dayjs> }
  | { kind: "ascii"; ctx: BaseCtx<string> }
  | { kind: "exifVersion"; ctx: BaseCtx<number[]> }
  | { kind: "number"; ctx: BaseCtx<number> };

// https://github.com/libexif/libexif/blob/b9b7f3c08c1b6812ad3b9d62227ad9527ab9385a/libexif/exif-entry.c#L1718
const DATETIME_TAGS = [
  "DATE_TIME",
  "DATE_TIME_ORIGINAL",
  "DATE_TIME_DIGITIZED",
];

export const classifyExifEntry = (
  exifEntryObject: ExifEntryObject,
  onValueChange: (value: string | ValidTypedArray) => void,
): ExifInputKind | null => {
  const mappedTag = EXIF_TAG_MAP[exifEntryObject.tag];

  if (
    mappedTag !== undefined &&
    exifEntryObject.components === 1 &&
    mappedTag.values !== undefined &&
    exifEntryObject.formattedValue != null &&
    exifEntryObject.formattedValue in mappedTag.values
  ) {
    return {
      kind: "enum",
      ctx: {
        exifEntryObject,
        value: exifEntryObject.formattedValue ?? "",
        onValueChange: (value) => {
          if (
            mappedTag.values !== undefined &&
            value in mappedTag.values &&
            mappedTag.values[value] !== undefined
          ) {
            onValueChange(
              newTypedArrayInFormat(
                [mappedTag.values[value]],
                exifEntryObject.format,
              ),
            );
          }
        },
        values: Object.keys(mappedTag.values),
      },
    };
  }

  if (
    mappedTag !== undefined &&
    exifEntryObject.components === 2 &&
    mappedTag.asciiValues !== undefined &&
    exifEntryObject.formattedValue != null &&
    Object.values(mappedTag.asciiValues).some(
      (value) => value === exifEntryObject.formattedValue,
    )
  ) {
    return {
      kind: "enum",
      ctx: {
        exifEntryObject,
        value:
          Object.entries(mappedTag.asciiValues)
            .find(([, value]) => value === exifEntryObject.formattedValue)
            ?.at(0) ?? "",
        onValueChange: (value) => {
          if (
            mappedTag.asciiValues !== undefined &&
            value in mappedTag.asciiValues &&
            mappedTag.asciiValues[value] !== undefined
          ) {
            onValueChange(encodeStringToUtf8(mappedTag.asciiValues[value]));
          }
        },
        values: Object.keys(mappedTag.asciiValues),
      },
    };
  }

  if (exifEntryObject.tag === "DATE_STAMP") {
    return {
      kind: "dateStamp",
      ctx: {
        exifEntryObject,
        value: dayjs(
          exifEntryObject.formattedValue ?? "",
          EXIF_DATESTAMP_FORMAT,
        ),
        onValueChange: (value) =>
          onValueChange(value.format(EXIF_DATESTAMP_FORMAT)),
      },
    };
  }

  if (exifEntryObject.tag === "VERSION_ID") {
    return {
      kind: "versionId",
      ctx: {
        exifEntryObject,
        value: exifEntryObject.value,
        onValueChange: (value) => onValueChange(new Uint8Array(value)),
      },
    };
  }

  if (DATETIME_TAGS.includes(exifEntryObject.tag)) {
    return {
      kind: "datetime",
      ctx: {
        exifEntryObject,
        value: dayjs(
          exifEntryObject.formattedValue ?? "",
          EXIF_TIMESTAMP_FORMAT,
        ),
        onValueChange: (value) => value.format(EXIF_TIMESTAMP_FORMAT),
      },
    };
  }

  if (exifEntryObject.format === "ASCII") {
    return {
      kind: "ascii",
      ctx: {
        exifEntryObject,
        value: exifEntryObject.formattedValue ?? "",
        onValueChange,
      },
    };
  }

  if (exifEntryObject.tag === "EXIF_VERSION" && exifEntryObject.size === 4) {
    return {
      kind: "exifVersion",
      ctx: {
        exifEntryObject,
        value: exifEntryObject.value,
        onValueChange: (value) => onValueChange(new Uint8Array(value)),
      },
    };
  }

  if (
    (exifEntryObject.format === "RATIONAL" ||
      exifEntryObject.format === "SRATIONAL") &&
    exifEntryObject.components === 1 &&
    exifEntryObject.value[0] !== undefined &&
    exifEntryObject.value[1] === 1
  ) {
    return {
      kind: "number",
      ctx: {
        exifEntryObject,
        value: exifEntryObject.value[0],
        onValueChange: (value) =>
          onValueChange(
            mapRationalFromObject([{ numerator: value, denominator: 1 }]),
          ),
      },
    };
  }

  if (
    exifEntryObject.format !== "SRATIONAL" &&
    exifEntryObject.format !== "RATIONAL" &&
    exifEntryObject.components === 1 &&
    exifEntryObject.value[0] !== undefined
  ) {
    return {
      kind: "number",
      ctx: {
        exifEntryObject,
        value: exifEntryObject.value[0],
        onValueChange: (value) =>
          onValueChange(newTypedArrayInFormat([value], exifEntryObject.format)),
      },
    };
  }

  return null;
};
