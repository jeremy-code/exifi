import { ErrorBoundary } from "react-error-boundary";

import { useExifData } from "#hooks/useExifData";

import { ExifGpsMap } from "./gps/ExifGpsMap";
import { IfdAccordion } from "./ifd/IfdAccordion";
import { MakerNoteAccordion } from "./makernote/MakerNoteAccordion";

const ExifViewerContent = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  return (
    <>
      <IfdAccordion exifData={exifData} />
      <ErrorBoundary
        fallback={
          <p className="text-muted-foreground">
            The GPS IFD was found in the image EXIF metadata, but valid
            longitude and latitude coordinates were not found.
          </p>
        }
      >
        <ExifGpsMap exifData={exifData} />
      </ErrorBoundary>
      <MakerNoteAccordion exifData={exifData} />
    </>
  );
};

export { ExifViewerContent };
