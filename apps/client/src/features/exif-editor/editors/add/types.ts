import type {
  CalendarDate,
  CalendarDateTime,
  Time,
} from "@internationalized/date";
import type { RationalObject } from "libexif-wasm";

import type { ExifVersion } from "#lib/exif/interfaces";
import type { UserComment } from "#lib/exif/userComment/interfaces";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

type AddEditorResolver = (
  entry: Partial<ExifEntryObject> & Pick<ExifEntryObject, "value">,
  onValueChange: (value: ExifEntryObject["value"]) => void,
) => AddEditor | null;

type ResolvedAddEditor<T> = {
  exifEntryObject: Partial<ExifEntryObject> & Pick<ExifEntryObject, "value">;
  value: T | undefined;
  onValueChange: (value: T) => void;
};

type AddEditor = (
  | ({ kind: "enum" } & ResolvedAddEditor<string> & { values: string[] })
  | ({
      kind: "enumAscii";
    } & ResolvedAddEditor<string> & { values: string[] })
  | ({ kind: "dateStamp" } & ResolvedAddEditor<CalendarDate | undefined>)
  | ({ kind: "versionId" } & ResolvedAddEditor<number[]>)
  | ({ kind: "datetime" } & ResolvedAddEditor<CalendarDateTime | undefined>)
  | ({ kind: "ascii" } & ResolvedAddEditor<string>)
  | ({ kind: "xp" } & ResolvedAddEditor<string>)
  | ({ kind: "exifVersion" } & ResolvedAddEditor<ExifVersion>)
  | ({ kind: "timeStamp" } & ResolvedAddEditor<Time | undefined>)
  | {
      kind: "numeric";
      exifEntryObject: Partial<ExifEntryObject>;
      values: number[];
      onValueChange: (value: number, index: number) => void;
    }
  | {
      kind: "rational";
      exifEntryObject: Partial<ExifEntryObject>;
      values: RationalObject[];
      onValueChange: (value: RationalObject, index: number) => void;
    }
  | {
      kind: "userComment";
      exifEntryObject: Partial<ExifEntryObject>;
      value: UserComment;
      onValueChange: (value: UserComment) => void;
    }
) & {
  hasIndeterminateSize?: boolean;
};

export type { ExifVersion, AddEditorResolver, AddEditor };
