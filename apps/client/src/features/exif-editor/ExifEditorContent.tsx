import { useState } from "react";

import { ExifData } from "libexif-wasm";

import { ExifInformation } from "#components/file/ExifInformation";
import { useExifData } from "#hooks/useExifData";

import { ExifTable } from "./components/ExifTable";
import { ExifToolbar } from "./components/ExifToolbar";
import { UnsavedDialog } from "./components/dialogs/UnsavedDialog";
import { ExifEditorProvider } from "./contexts/ExifEditorContext";

const ExifEditorContent = ({ file }: { file: File }) => {
  const exifDataFromFile = useExifData(file);
  const [exifData, setExifData] = useState(ExifData.new());

  if (exifDataFromFile !== null && exifData !== exifDataFromFile) {
    setExifData((prev) => {
      prev.free();
      return exifDataFromFile;
    });
  }

  return (
    <ExifEditorProvider exifData={exifData}>
      <ExifInformation exifData={exifData} />
      <ExifToolbar />
      <ExifTable />
      <UnsavedDialog />
    </ExifEditorProvider>
  );
};

export { ExifEditorContent };
