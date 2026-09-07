import type { Time } from "@internationalized/date";
import { mapRationalToObject } from "libexif-wasm";

import {
  parseTimeStamp,
  formatTimeStamp,
} from "@exifi/core/exif/date/timeStamp";

import type { AddEditorResolver } from "../interfaces";

const resolveTimeStamp: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "TIME_STAMP" &&
    exifEntryObject.format === "RATIONAL" &&
    (exifEntryObject.value.length === 0 || exifEntryObject.value.length === 3)
  ) {
    let value: Time | undefined = undefined;

    try {
      value =
        exifEntryObject.value.length === 0
          ? undefined
          : parseTimeStamp(exifEntryObject.value);
    } catch (e) {
      console.error("Error when attempting to parse timeStamp", e);
    }

    return {
      kind: "timeStamp",
      exifEntryObject,
      value,
      onValueChange: (value) =>
        onValueChange(
          value === undefined
            ? []
            : mapRationalToObject(new Uint32Array(formatTimeStamp(value))),
        ),
    };
  }

  return null;
};

export { resolveTimeStamp };
