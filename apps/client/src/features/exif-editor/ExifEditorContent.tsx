import { useState } from "react";

import { ExifData } from "libexif-wasm";

import { ExifInformation } from "#components/file/ExifInformation";
import { useExifData } from "#hooks/useExifData";
import { toastQueue } from "@exifi/ui/components/Toast";

import { ExifTable } from "./components/ExifTable";
import { ExifToolbar } from "./components/ExifToolbar";
import { UnsavedDialog } from "./components/dialogs/UnsavedDialog";
import { ExifEditorProvider } from "./contexts/ExifEditorContext";

const initializeExifData = () => {
  toastQueue.add(
    {
      title: "No Exif data was found. Initializing with default Exif data...",
    },
    { timeout: 5_000 /* 5 seconds */ },
  );
  console.log("Initializing Exif data...");
  return ExifData.new();
};

// TODO: emptyExifData is a module level variable. This does mean there will be
// one minimal leak, but given the size of an empty Exif data and that this is
// only instantiated when a file with no Exif data is found (ideally rare), I
// believe this is worthwhile.
let emptyExifData: ExifData | null = null;

const ExifEditorContent = ({ file }: { file: File }) => {
  const exifDataFromFile = useExifData(file);
  const [exifData, setExifData] = useState(exifDataFromFile);

  if (exifData === null) {
    setExifData((emptyExifData ??= initializeExifData()));
  } else if (exifDataFromFile !== null && exifData !== exifDataFromFile) {
    setExifData(exifDataFromFile);
  }

  return (
    <ExifEditorProvider exifData={exifData!}>
      <ExifInformation exifData={exifData!} />
      <ExifToolbar />
      <ExifTable />
      <UnsavedDialog />
    </ExifEditorProvider>
  );
};

export { ExifEditorContent };
