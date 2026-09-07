import type {
  CalendarDate,
  CalendarDateTime,
  Time,
} from "@internationalized/date";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

import type { ExifVersion } from "../shared/interfaces";

type QuickEditorResolver = (
  entry: ExifEntryObject,
  onValueChange: (value: ExifEntryObject["value"]) => void,
) => QuickEditor | null;

type ResolvedQuickEditor<T> = {
  value: T;
  onValueChange: (value: T) => void;
};

type QuickEditor =
  | ({ kind: "enum" } & ResolvedQuickEditor<string> & { values: string[] })
  | ({ kind: "enumAscii" } & ResolvedQuickEditor<string> & { values: string[] })
  | ({ kind: "dateStamp" } & ResolvedQuickEditor<CalendarDate>)
  | ({ kind: "versionId" } & ResolvedQuickEditor<number[]>)
  | ({ kind: "datetime" } & ResolvedQuickEditor<CalendarDateTime>)
  | ({ kind: "ascii" } & ResolvedQuickEditor<string>)
  | ({ kind: "xp" } & ResolvedQuickEditor<string>)
  | ({ kind: "exifVersion" } & ResolvedQuickEditor<ExifVersion>)
  | ({ kind: "simpleNumeric" } & ResolvedQuickEditor<number>)
  | ({ kind: "timeStamp" } & ResolvedQuickEditor<Time>);

export type { QuickEditorResolver, QuickEditor };
