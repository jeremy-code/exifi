import { ExifIfd } from "libexif-wasm";
import { ErrorBoundary } from "react-error-boundary";

import { ExifInformation } from "#components/file/ExifInformation";
import { useExifData } from "#hooks/useExifData";

import { ExifGpsMap } from "./gps/ExifGpsMap";
import { IfdAccordion } from "./ifd/IfdAccordion";
import { MakerNoteAccordion } from "./makernote/MakerNoteAccordion";

const ExifViewerContent = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  const exifDataGps = exifData.ifd[ExifIfd.GPS];

  return (
    <>
      <ExifInformation exifData={exifData} />
      <IfdAccordion exifData={exifData} />
      {exifDataGps.count !== 0 && (
        <ErrorBoundary
          fallback={
            <p className="text-muted-foreground">
              The GPS IFD was found in the image EXIF metadata, but valid
              longitude and latitude coordinates were not found.
            </p>
          }
        >
          <ExifGpsMap exifDataGps={exifDataGps} />
        </ErrorBoundary>
      )}

      <MakerNoteAccordion exifData={exifData} />
    </>
  );
};

export { ExifViewerContent };
