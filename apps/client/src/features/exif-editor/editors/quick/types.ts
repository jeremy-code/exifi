import type {
  CalendarDate,
  CalendarDateTime,
  Time,
} from "@internationalized/date";
import type { ValidTypedArray } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

type ExifVersion = {
  major: number;
  minor: number;
};

type QuickEditorResolver = (
  entry: ExifEntryObject,
  onValueChange: (value: string | ValidTypedArray) => void,
) => QuickEditor | null;

type ResolvedQuickEditor<T> = {
  exifEntryObject: ExifEntryObject;
  value: T;
  onValueChange: (value: T) => void;
};

type QuickEditor =
  | ({ kind: "enum" } & ResolvedQuickEditor<string> & { values: string[] })
  | ({
      kind: "enumAscii";
    } & ResolvedQuickEditor<string> & { values: string[] })
  | ({ kind: "dateStamp" } & ResolvedQuickEditor<CalendarDate>)
  | ({ kind: "versionId" } & ResolvedQuickEditor<number[]>)
  | ({ kind: "datetime" } & ResolvedQuickEditor<CalendarDateTime>)
  | ({ kind: "ascii" } & ResolvedQuickEditor<string>)
  | ({ kind: "xp" } & ResolvedQuickEditor<string>)
  | ({ kind: "exifVersion" } & ResolvedQuickEditor<ExifVersion>)
  | ({ kind: "simpleNumeric" } & ResolvedQuickEditor<number>)
  | ({ kind: "timeStamp" } & ResolvedQuickEditor<Time>);

export type { ExifVersion, QuickEditorResolver, QuickEditor };
