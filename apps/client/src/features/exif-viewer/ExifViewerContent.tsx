import { lazy, Suspense } from "react";

import { ExifIfd } from "libexif-wasm";
import { ErrorBoundary } from "react-error-boundary";

import { Link as RouterLink } from "#components/common/Link";
import { ExifInformation } from "#components/file/ExifInformation";
import { useExifData } from "#hooks/useExifData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exifi/ui/components/Card";
import { Skeleton } from "@exifi/ui/components/Skeleton";

import { IfdAccordion } from "./components/ifd/IfdAccordion";
import { MakerNoteAccordion } from "./components/makernote/MakerNoteAccordion";

const ExifGpsMap = lazy(() =>
  import("./components/gps/ExifGpsMap").then((m) => ({
    default: m.ExifGpsMap,
  })),
);

const ExifViewerContent = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  if (exifData === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exif information</CardTitle>
        </CardHeader>
        <CardContent>
          No Exif data was found in this file. Would you like to{" "}
          <RouterLink to="/editor">open it in the editor</RouterLink> to add
          some?
        </CardContent>
      </Card>
    );
  }

  const exifDataGps = exifData.ifd[ExifIfd.GPS];

  return (
    <>
      <ExifInformation exifData={exifData} />
      <IfdAccordion exifData={exifData} />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
        {exifDataGps.count !== 0 && (
          <ErrorBoundary
            fallback={
              <p className="text-fg-muted">
                The GPS IFD was found in the image EXIF metadata, but valid
                longitude and latitude coordinates were not found.
              </p>
            }
          >
            <ExifGpsMap exifDataGps={exifDataGps} />
          </ErrorBoundary>
        )}
      </Suspense>

      <MakerNoteAccordion exifData={exifData} />
    </>
  );
};

export { ExifViewerContent };
