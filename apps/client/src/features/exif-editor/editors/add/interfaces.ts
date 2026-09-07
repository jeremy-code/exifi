import type {
  CalendarDate,
  CalendarDateTime,
  Time,
} from "@internationalized/date";
import type { RationalObject } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import type { UserComment } from "@exifi/core/exif/userComment/interfaces";

import type { SelectionMode, ExifVersion } from "../shared/interfaces";

type AddEditorResolver = (
  entry: Partial<ExifEntryObject> & Pick<ExifEntryObject, "value">,
  onValueChange: (value: ExifEntryObject["value"]) => void,
) => AddEditor | null;

type ResolvedAddEditor<
  T,
  M extends SelectionMode = "single",
> = M extends "single"
  ? { value: T | undefined; onValueChange: (value: T) => void }
  : { values: T[]; onValueChange: (value: T, index: number) => void };

type AddEditor = (
  | ({ kind: "enum" } & ResolvedAddEditor<string> & { values: string[] })
  | ({ kind: "enumAscii" } & ResolvedAddEditor<string> & { values: string[] })
  | ({ kind: "dateStamp" } & ResolvedAddEditor<CalendarDate>)
  | ({ kind: "versionId" } & ResolvedAddEditor<number[]>)
  | ({ kind: "datetime" } & ResolvedAddEditor<CalendarDateTime>)
  | ({ kind: "ascii" } & ResolvedAddEditor<string>)
  | ({ kind: "xp" } & ResolvedAddEditor<string>)
  | ({ kind: "exifVersion" } & ResolvedAddEditor<ExifVersion>)
  | ({ kind: "timeStamp" } & ResolvedAddEditor<Time>)
  | ({ kind: "numeric" } & ResolvedAddEditor<number, "multiple">)
  | ({ kind: "rational" } & ResolvedAddEditor<RationalObject, "multiple">)
  | ({ kind: "userComment" } & ResolvedAddEditor<UserComment>)
) & { hasIndeterminateSize?: boolean };

export type { AddEditorResolver, AddEditor };
