import { exifIfdGetName, ExifTagInfo, type ExifContent } from "libexif-wasm";

import { formatPlural } from "#utils/formatPlural";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@exifi/ui/components/Accordion";
import { Badge } from "@exifi/ui/components/Badge";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@exifi/ui/components/Tooltip";

const IfdAccordionItem = ({ exifContent }: { exifContent: ExifContent }) => {
  const ifdName = exifContent.ifd;
  if (ifdName === null) {
    throw new Error("Invalid IFD");
  }

  const isEmpty = exifContent.count === 0;

  return (
    <AccordionItem key={ifdName} value={ifdName} disabled={isEmpty}>
      <AccordionTrigger>
        <div className="flex gap-2">
          {exifIfdGetName(ifdName)}
          <Badge>
            {formatPlural(exifContent.count, {
              one: " tag",
              other: " tags",
            })}
          </Badge>
        </div>
      </AccordionTrigger>

      {!isEmpty && (
        <AccordionContent>
          <DataList variant="bold">
            {exifContent.entries
              .filter((entry) => entry.tag !== null)
              .map((entry) => {
                const tag = entry.tag!;
                const title = ExifTagInfo.getTitleInIfd(tag, ifdName);
                const description = ExifTagInfo.getDescriptionInIfd(
                  tag,
                  ifdName,
                );

                return (
                  <DataListItem className="flex-col! md:flex-row!" key={tag}>
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
};

export { IfdAccordionItem };
