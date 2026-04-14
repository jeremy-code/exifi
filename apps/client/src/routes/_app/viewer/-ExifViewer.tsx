import { Suspense, type ComponentPropsWithRef } from "react";

import { ArrowLeft } from "lucide-react";
import { cn } from "tailwind-variants";

import { FileInformation } from "#components/file/FileInformation";
import { useDropzoneStore } from "#hooks/useDropzoneStore";
import { Button } from "@exiftools/ui/components/Button";
import { Skeleton } from "@exiftools/ui/components/Skeleton";

import { ExifViewerData } from "./-ExifViewerData";

type ExifViewerProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifViewer = ({ file, className, ...props }: ExifViewerProps) => {
  const removeAcceptedFileByIndex = useDropzoneStore(
    (state) => state.removeAcceptedFileByIndex,
  );

  return (
    <div>
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <div>
          <Button variant="ghost" onClick={() => removeAcceptedFileByIndex(0)}>
            <ArrowLeft className="size-[1em]" />
            Upload different image
          </Button>
        </div>
        <FileInformation file={file} />
        <Suspense fallback={<Skeleton className="h-50 w-full" />}>
          <ExifViewerData file={file} />
        </Suspense>
      </div>
    </div>
  );
};

export { ExifViewer, type ExifViewerProps };
