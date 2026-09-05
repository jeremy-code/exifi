import { useCallback, useMemo, useState } from "react";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { typedArrayInFormat } from "@exifi/core/exif/utils/typedArrayInFormat";
import { arrayLikeEquals } from "@exifi/utils/arrayLikeEquals";

import { useExifEditor } from "../contexts/ExifEditorContext";

const useExifEntryDraft = (exifEntryObject: ExifEntryObject) => {
  const updateExifEntry = useExifEditor((s) => s.updateExifEntry);
  const [draft, setDraft] = useState(exifEntryObject.value);

  const isChanged = useMemo(
    () => !arrayLikeEquals(exifEntryObject.value, draft),
    [exifEntryObject.value, draft],
  );

  const save = useCallback(() => {
    updateExifEntry(
      exifEntryObject,
      typedArrayInFormat(draft, exifEntryObject.format),
    );
  }, [draft, exifEntryObject, updateExifEntry]);

  return { draft, setDraft, isChanged, save };
};

export { useExifEntryDraft };
