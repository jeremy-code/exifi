import { lazy, Suspense } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { CatchBoundary } from "@tanstack/react-router";
import { ExifIfd } from "libexif-wasm";

import { Link as RouterLink } from "#components/common/Link";
import { ExifInformation } from "#components/file/ExifInformation";
import { useExifData } from "#hooks/useExifData";
import { m } from "#paraglide/messages";
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
  import("./components/gps/ExifGpsMap").then((mod) => ({
    default: mod.ExifGpsMap,
  })),
);

// Otherwise, if declared in prop, Oxlint will error with
// react(no-unstable-nested-components)
const ExifGpsMapErrorComponent = () => (
  <p className="text-fg-muted">{m.viewer_gps_map_error()}</p>
);

const ExifViewerContent = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  if (exifData === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{m.viewer_no_exif_title()}</CardTitle>
        </CardHeader>
        <CardContent>
          <ParaglideMessage
            message={m.viewer_no_exif_body}
            markup={{
              editorLink: ({ children }) => (
                <RouterLink underline to="/editor">
                  {children}
                </RouterLink>
              ),
            }}
          />
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
          <CatchBoundary
            getResetKey={() => ""}
            errorComponent={ExifGpsMapErrorComponent}
          >
            <ExifGpsMap exifDataGps={exifDataGps} />
          </CatchBoundary>
        )}
      </Suspense>

      <MakerNoteAccordion exifData={exifData} />
    </>
  );
};

export { ExifViewerContent };
