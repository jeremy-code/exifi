import type { ComponentPropsWithRef } from "react";

import { useQuery } from "@tanstack/react-query";
import { ExifIfd, ExifTagInfo, getEnumKeyFromValue } from "libexif-wasm";
import { ArrowLeft } from "lucide-react";
import { cn } from "tailwind-variants";

import { FileInformation } from "#components/file/FileInformation";
import { useDropzoneState } from "#hooks/useDropzoneState";
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

type ExifViewerProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifViewer = ({ file, className, ...props }: ExifViewerProps) => {
  const { isPending, data: arrayBuffer } = useQuery({
    queryKey: [file] as const,
    queryFn: ({ queryKey: [file] }) => file.arrayBuffer(),
  });
  const exifData = useExifData(arrayBuffer);
  const removeAcceptedFileByIndex = useDropzoneState(
    (state) => state.removeAcceptedFileByIndex,
  );

  if (exifData === null) {
    if (isPending) {
      return <Skeleton className="h-50" />;
    } else {
      return (
        <>An error occurred while attempting to read the file's EXIF data.</>
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div>
        <Button variant="ghost" onClick={() => removeAcceptedFileByIndex(0)}>
          <ArrowLeft className="size-[1em]" />
          Upload different image
        </Button>
      </div>
      <FileInformation file={file} />
      <Accordion
        // Expand all nonempty IFDs
        defaultValue={exifData.ifd
          .filter((ifd) => ifd.entries.length !== 0)
          .map((_, index) => getEnumKeyFromValue(ExifIfd, index) ?? "COUNT")}
        variant="enclosed"
        type="multiple"
        size="lg"
        className="shadow-sm"
      >
        {exifData.ifd.map((ifd, index) => {
          const ifdName = getEnumKeyFromValue(ExifIfd, index) ?? "COUNT";
          if (ifdName === "COUNT") {
            throw new Error("Invalid number of IFDs found");
          }
          const isEmpty = ifd.entries.length === 0;

          return (
            <AccordionItem key={ifdName} value={ifdName} disabled={isEmpty}>
              <AccordionTrigger>
                <div className="flex gap-2">
                  {ifdName}
                  <Badge>
                    {formatPlural(ifd.entries.length, {
                      one: " tag",
                      other: " tags",
                    })}
                  </Badge>
                </div>
              </AccordionTrigger>

              {!isEmpty ?
                <AccordionContent>
                  <DataList>
                    {ifd.entries
                      .filter((entry) => entry.tag !== null)
                      .map((entry) => (
                        <DataListItem
                          className="flex-col! max-md:items-start md:flex-row!"
                          key={entry.tag}
                        >
                          <DataListItemLabel className="font-medium md:w-1/3">
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger className="select-text">
                                {ExifTagInfo.getTitleInIfd(entry.tag!, ifdName)}
                              </TooltipTrigger>
                              <TooltipContent>
                                {ExifTagInfo.getDescriptionInIfd(
                                  entry.tag!,
                                  ifdName,
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </DataListItemLabel>
                          <DataListItemValue className="relative before:relative before:left-0 before:pr-1.5 before:text-muted-foreground before:content-['=']">
                            {entry.getValue()}
                          </DataListItemValue>
                        </DataListItem>
                      ))}
                  </DataList>
                </AccordionContent>
              : null}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export { ExifViewer, type ExifViewerProps };
