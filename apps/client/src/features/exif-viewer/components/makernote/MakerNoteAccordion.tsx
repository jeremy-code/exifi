import type { ExifData } from "libexif-wasm";

import { formatPlural } from "#utils/formatPlural";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exiftools/ui/components/Accordion";
import { Badge } from "@exiftools/ui/components/Badge";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exiftools/ui/components/DataList";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@exiftools/ui/components/Tooltip";

const MakerNoteAccordion = ({ exifData }: { exifData: ExifData }) => {
  const mnoteData = exifData.mnoteData;

  if (mnoteData === null) {
    return null;
  }

  return (
    <Accordion
      defaultValue={["MAKERNOTE"]}
      variant="enclosed"
      type="multiple"
      size="lg"
      className="shadow-sm"
    >
      <AccordionItem value="MAKERNOTE">
        <AccordionTrigger>
          <div className="flex gap-2">
            Makernote
            <Badge>
              {formatPlural(mnoteData.dataCount, {
                one: " tag",
                other: " tags",
              })}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <DataList variant="bold">
            {mnoteData.data.map((mnoteDatum, index) => (
              <DataListItem
                className="flex-col! md:flex-row!"
                key={index} // id is not unique
              >
                <DataListItemLabel className="md:w-1/3">
                  {(
                    mnoteDatum.description !== null &&
                    mnoteDatum.description !== ""
                  ) ?
                    <Tooltip>
                      <TooltipTrigger className="select-auto">
                        {mnoteDatum.title}
                      </TooltipTrigger>
                      <TooltipContent>{mnoteDatum.description}</TooltipContent>
                    </Tooltip>
                  : (mnoteDatum.title ??
                    mnoteDatum.name ??
                    `ID ${mnoteDatum.id} (${index})`)
                  }
                </DataListItemLabel>
                <DataListItemValue className="relative before:relative before:left-0 before:pr-1.5 before:text-muted-foreground before:content-['=']">
                  {mnoteDatum.value}
                </DataListItemValue>
              </DataListItem>
            ))}
          </DataList>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { MakerNoteAccordion };
