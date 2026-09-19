import { lazy, Suspense } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { ExifIfd } from "libexif-wasm";
import { ErrorBoundary } from "react-error-boundary";

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

const ExifViewerContent = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  if (exifData === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{m["exifInformation.label"]()}</CardTitle>
        </CardHeader>
        <CardContent>
          <ParaglideMessage
            message={m["noble_watery_panther_commend"]}
            markup={{
              link: (linkProps) => <RouterLink to="/editor" {...linkProps} />,
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
          <ErrorBoundary
            fallback={
              <p className="text-fg-muted">{m.patient_odd_lizard_edit()}</p>
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
