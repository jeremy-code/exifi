import { formatExifDateStamp } from "#lib/exif/date/dateStamp/formatExifDateStamp";
import { parseExifDateStamp } from "#lib/exif/date/dateStamp/parseExifDateStamp";
import { decodeStringFromUtf8 } from "@exifi/utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import type { AddEditorResolver } from "../types";

const resolveDateStamp: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.tag === "DATE_STAMP") {
    return {
      kind: "dateStamp",
      exifEntryObject,
      value:
        exifEntryObject.value.length !== 0
          ? parseExifDateStamp(
              decodeStringFromUtf8(new Uint8Array(exifEntryObject.value)),
            )
          : undefined,
      onValueChange: (value) =>
        onValueChange(
          value !== undefined
            ? Array.from(encodeStringToUtf8(formatExifDateStamp(value)))
            : [],
        ),
    };
  }

  return null;
};

export { resolveDateStamp };
