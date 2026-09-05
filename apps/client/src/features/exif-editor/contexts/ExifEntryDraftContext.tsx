import { createContext, use, type Dispatch, type SetStateAction } from "react";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

type ExifEntryDraft = {
  exifEntryObject: ExifEntryObject;
  draft: ExifEntryObject["value"];
  setDraft: Dispatch<SetStateAction<ExifEntryObject["value"]>>;
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
