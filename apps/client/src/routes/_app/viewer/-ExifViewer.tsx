import { Suspense, type ComponentPropsWithRef } from "react";

import { ExifTagInfo } from "libexif-wasm";
import { ArrowLeft } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "tailwind-variants";

import { FileInformation } from "#components/file/FileInformation";
import { useDropzoneStore } from "#hooks/useDropzoneStore";
import { useExifData } from "#hooks/useExifData";
import { formatPlural } from "#utils/formatPlural";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exiftools/ui/components/Accordion";
import { Badge } from "@exiftools/ui/components/Badge";
import { Button } from "@exiftools/ui/components/Button";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exiftools/ui/components/DataList";
import { Skeleton } from "@exiftools/ui/components/Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@exiftools/ui/components/Tooltip";

import { ExifViewerGps } from "./-ExifViewerGps";

const ExifViewerData = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  return (
    <Suspense fallback={<Skeleton className="h-40 w-full" />}>
      <Accordion
        // Expand all nonempty IFDs
        defaultValue={exifData.ifd
          .filter((ifd) => ifd.count !== 0)
          .map((ifd) => ifd.ifd)
          .filter((ifd) => ifd !== null)}
        variant="enclosed"
        type="multiple"
        size="lg"
        className="shadow-sm"
      >
        {exifData.ifd.map((ifd) => {
          const ifdName = ifd.ifd;
          if (ifdName === null) {
            throw new Error("Invalid IFD");
          }

          const isEmpty = ifd.count === 0;

          return (
            <AccordionItem key={ifdName} value={ifdName} disabled={isEmpty}>
              <AccordionTrigger>
                <div className="flex gap-2">
                  {ifdName}
                  <Badge>
                    {formatPlural(ifd.count, {
                      one: " tag",
                      other: " tags",
                    })}
                  </Badge>
                </div>
              </AccordionTrigger>

              {!isEmpty && (
                <AccordionContent>
                  <DataList variant="bold">
                    {ifd.entries
                      .filter((entry) => entry.tag !== null)
                      .map((entry) => {
                        const tag = entry.tag!;
                        const title = ExifTagInfo.getTitleInIfd(tag, ifdName);
                        const description = ExifTagInfo.getDescriptionInIfd(
                          tag,
                          ifdName,
                        );

                        return (
                          <DataListItem
                            className="flex-col! md:flex-row!"
                            key={tag}
                          >
                            <DataListItemLabel className="md:w-1/3">
                              {/* Some tags (e.g. RECOMMENDED_EXPOSURE_INDEX) don't have a description in ExifTagTable[] */}
                              {description !== null && description !== "" ?
                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger className="select-auto">
                                    {title}
                                  </TooltipTrigger>
                                  <TooltipContent>{description}</TooltipContent>
                                </Tooltip>
                              : title}
                            </DataListItemLabel>
                            <DataListItemValue className="relative before:relative before:left-0 before:pr-1.5 before:text-muted-foreground before:content-['=']">
                              {entry.toString()}
                            </DataListItemValue>
                          </DataListItem>
                        );
                      })}
                  </DataList>
                </AccordionContent>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
      <ErrorBoundary
        fallback={
          <p className="text-muted-foreground">
            The GPS IFD was found in the image EXIF metadata, but valid
            longitude and latitude coordinates were not found.
          </p>
        }
      >
        <ExifViewerGps exifData={exifData} />
      </ErrorBoundary>
    </Suspense>
  );
};

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
