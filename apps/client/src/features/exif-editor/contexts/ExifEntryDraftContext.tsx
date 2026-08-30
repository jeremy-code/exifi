import { createContext, use, type Dispatch, type SetStateAction } from "react";

import type { RationalObject } from "libexif-wasm";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

type ExifEntryDraft = {
  exifEntryObject: ExifEntryObject;
  draft: RationalObject[] | string | number[];
  setDraft: Dispatch<SetStateAction<RationalObject[] | string | number[]>>;
};
const ExifEntryDraftContext = createContext<ExifEntryDraft | null>(null);

const useExifEntryDraftContext = () => {
  const context = use(ExifEntryDraftContext);
  if (context === null) {
    throw new Error("Missing ExifEntryDraftContext in the tree");
  }

  return context;
};

export { useExifEntryDraftContext, ExifEntryDraftContext, type ExifEntryDraft };
