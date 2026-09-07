import type { RationalObject } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import type { UserComment } from "@exifi/core/exif/userComment/interfaces";

import type { SelectionMode } from "../shared/interfaces";

type AdvancedEditorResolver = (
  entry: ExifEntryObject,
  onValueChange: (value: ExifEntryObject["value"]) => void,
) => AdvancedEditor | null;

type ResolvedAdvancedEditor<
  T,
  M extends SelectionMode = "single",
> = M extends "single"
  ? { value: T; onValueChange: (value: T) => void }
  : { values: T[]; onValueChange: (value: T, index: number) => void };

type AdvancedEditor =
  | ({ kind: "userComment" } & ResolvedAdvancedEditor<UserComment>)
  | ({ kind: "xp" } & ResolvedAdvancedEditor<string>)
  | ({ kind: "rational" } & ResolvedAdvancedEditor<RationalObject, "multiple">)
  | ({ kind: "ascii" } & ResolvedAdvancedEditor<string>)
  | ({ kind: "numeric" } & ResolvedAdvancedEditor<number, "multiple">);

export type { AdvancedEditorResolver, AdvancedEditor };
