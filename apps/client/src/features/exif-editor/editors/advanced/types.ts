import type { RationalObject } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import type { UserComment } from "@exifi/core/exif/userComment/interfaces";

type AdvancedEditorResolver = (
  entry: ExifEntryObject,
  onValueChange: (value: ExifEntryObject["value"]) => void,
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
