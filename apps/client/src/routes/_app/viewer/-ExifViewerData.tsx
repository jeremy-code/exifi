import { ExifTagInfo } from "libexif-wasm";
import { ErrorBoundary } from "react-error-boundary";

import { useExifData } from "#hooks/useExifData";
import { formatPlural } from "#utils/formatPlural";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@exiftools/ui/components/Accordion";
import { Badge } from "@exiftools/ui/components/Badge";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exiftools/ui/components/DataList";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@exiftools/ui/components/Tooltip";

import { ExifViewerGps } from "./-ExifViewerGps";

const ExifViewerData = ({ file }: { file: File }) => {
  const exifData = useExifData(file);
  return (
    <>
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
                                <Tooltip>
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
    </>
  );
};

export { ExifViewerData };
