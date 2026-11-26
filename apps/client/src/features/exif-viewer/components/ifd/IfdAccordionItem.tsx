import type { ExifContent } from "libexif-wasm";

import {
  getExifIfdName,
  getExifTagDescription,
  getExifTagTitle,
} from "#lib/exif/labels";
import { m } from "#paraglide/messages";
import {
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
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
  TooltipTarget,
  Tooltip,
} from "@exifi/ui/components/Tooltip";
import { focusRing } from "@exifi/ui/utils/focusRing";

const IfdAccordionItem = ({ exifContent }: { exifContent: ExifContent }) => {
  const ifdName = exifContent.ifd;
  if (ifdName === null) {
    throw new Error("Invalid IFD");
  }

  const isEmpty = exifContent.count === 0;

  return (
    <AccordionItem id={ifdName} isDisabled={isEmpty}>
      <AccordionHeader>
        <div className="flex gap-2 text-sm in-data-[disabled=true]:opacity-50">
          {getExifIfdName(ifdName)}
          <Badge variant="muted">
            {m.viewer_tag_count({ count: exifContent.count })}
          </Badge>
        </div>
      </AccordionHeader>

      {!isEmpty && (
        <AccordionPanel>
          <DataList variant="bold">
            {exifContent.entries
              .filter((entry) => entry.tag !== null)
              .map((entry) => {
                const tag = entry.tag!;
                const title = getExifTagTitle(tag, ifdName);
                const description = getExifTagDescription(tag, ifdName);

                return (
                  <DataListItem className="flex-col! md:flex-row!" key={tag}>
                    <DataListItemLabel className="md:w-1/3">
                      {/* Some tags (e.g. RECOMMENDED_EXPOSURE_INDEX) don't have a description in ExifTagTable[] */}
                      {description !== "" ? (
                        <TooltipTrigger>
                          <TooltipTarget>
                            <span
                              role="button"
                              className={focusRing({
                                className: "focus-visible:outline-2",
                              })}
                            >
                              {title}
                            </span>
                          </TooltipTarget>
                          <Tooltip>{description}</Tooltip>
                        </TooltipTrigger>
                      ) : (
                        title
                      )}
                    </DataListItemLabel>
                    <DataListItemValue className="relative wrap-anywhere before:relative before:left-0 before:pr-1.5 before:text-fg-muted before:content-['=']">
                      {entry.toString()}
                    </DataListItemValue>
                  </DataListItem>
                );
              })}
          </DataList>
        </AccordionPanel>
      )}
    </AccordionItem>
  );
};

export { IfdAccordionItem };
