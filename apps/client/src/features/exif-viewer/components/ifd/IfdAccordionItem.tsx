import { exifIfdGetName, ExifTagInfo, type ExifContent } from "libexif-wasm";
import { useLocale } from "react-aria/I18nProvider";

import { formatPlural } from "#utils/formatPlural";
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

const IfdAccordionItem = ({ exifContent }: { exifContent: ExifContent }) => {
  const { locale } = useLocale();

  const ifdName = exifContent.ifd;
  if (ifdName === null) {
    throw new Error("Invalid IFD");
  }

  const isEmpty = exifContent.count === 0;

  return (
    <AccordionItem id={ifdName} isDisabled={isEmpty}>
      <AccordionHeader>
        <div className="flex gap-2 text-sm in-data-[disabled=true]:opacity-50">
          {exifIfdGetName(ifdName)}
          <Badge>
            {formatPlural(
              exifContent.count,
              { one: " tag", other: " tags" },
              locale,
            )}
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
                const title = ExifTagInfo.getTitleInIfd(tag, ifdName);
                const description = ExifTagInfo.getDescriptionInIfd(
                  tag,
                  ifdName,
                );

                return (
                  <DataListItem className="flex-col! md:flex-row!" key={tag}>
                    <DataListItemLabel className="md:w-1/3">
                      {/* Some tags (e.g. RECOMMENDED_EXPOSURE_INDEX) don't have a description in ExifTagTable[] */}
                      {description !== "" ? (
                        <TooltipTrigger>
                          <TooltipTarget>
                            <span role="button">{title}</span>
                          </TooltipTarget>
                          <Tooltip>{description}</Tooltip>
                        </TooltipTrigger>
                      ) : (
                        title
                      )}
                    </DataListItemLabel>
                    <DataListItemValue className="relative before:relative before:left-0 before:pr-1.5 before:text-fg-muted before:content-['=']">
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
