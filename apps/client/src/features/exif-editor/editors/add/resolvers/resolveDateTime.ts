import { DATETIME_TAGS } from "#lib/exif/date/constants";
import { formatExifDateTime } from "#lib/exif/date/dateTime/formatExifDateTime";
import { parseExifDateTime } from "#lib/exif/date/dateTime/parseExifDateTime";
import { decodeStringFromUtf8 } from "@exifi/utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import type { AddEditorResolver } from "../types";

const resolveDateTime: AddEditorResolver = (exifEntryObject, onValueChange) => {
  if (
    exifEntryObject.tag !== undefined &&
    DATETIME_TAGS.includes(exifEntryObject.tag)
  ) {
    return {
      kind: "datetime",
      exifEntryObject,
      value:
        exifEntryObject.value.length !== 0
          ? parseExifDateTime(
              decodeStringFromUtf8(new Uint8Array(exifEntryObject.value)),
            )
          : undefined,
      onValueChange: (value) =>
        onValueChange(
          value !== undefined
            ? Array.from(encodeStringToUtf8(formatExifDateTime(value)))
            : [],
        ),
    };
  }

  return null;
};

export { resolveDateTime };
