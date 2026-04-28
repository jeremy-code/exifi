import type { ComponentPropsWithRef } from "react";

import { ExifInformation } from "#components/file/ExifInformation";

import { useExifEditorContext } from "../hooks/useExifEditorContext";

const ExifInspector = (
  props: Omit<ComponentPropsWithRef<typeof ExifInformation>, "exifData">,
) => {
  const exifData = useExifEditorContext();

  return <ExifInformation exifData={exifData} {...props} />;
};

export { ExifInspector };
