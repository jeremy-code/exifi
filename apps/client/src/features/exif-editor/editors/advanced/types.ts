import type { RationalObject } from "libexif-wasm";

import type { ExifEntryObject } from "#lib/exif/serializeExifData";

type AdvancedEditorResolver = (
  entry: ExifEntryObject,
  value: number[],
  onValueChange: (value: number[]) => void,
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
      value: number[];
      onValueChange: (value: number[]) => void;
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
