import type { RationalObject } from "libexif-wasm";

import type { UserComment } from "#lib/exif/userComment/interfaces";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

type AdvancedEditorResolver = (
  entry: ExifEntryObject,
  onValueChange: (value: string | number[] | RationalObject[]) => void,
) => AdvancedEditor | null;

type ResolvedAdvancedEditor<T> = {
  exifEntryObject: ExifEntryObject;
  values: T[];
  onValueChange: (value: T, index: number) => void;
};

type AdvancedEditor =
  | {
      kind: "userComment";
      exifEntryObject: ExifEntryObject;
      value: UserComment;
      onValueChange: (value: UserComment) => void;
    }
  | {
      kind: "xp";
      exifEntryObject: ExifEntryObject;
      value: string;
      onValueChange: (value: string) => void;
    }
  | ({ kind: "rational" } & ResolvedAdvancedEditor<RationalObject>)
  | {
      kind: "ascii";
      exifEntryObject: ExifEntryObject;
      value: string;
      onValueChange: (value: string) => void;
    }
  | ({
      kind: "numeric";
    } & ResolvedAdvancedEditor<number>);

export type { AdvancedEditorResolver, AdvancedEditor };
