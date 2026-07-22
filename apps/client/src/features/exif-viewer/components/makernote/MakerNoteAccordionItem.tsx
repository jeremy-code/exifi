import type { ExifMnoteData } from "libexif-wasm";
import { useLocale } from "react-aria/I18nProvider";

import { formatPlural } from "#utils/format/formatPlural";
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
  Tooltip,
  TooltipTarget,
  TooltipTrigger,
} from "@exifi/ui/components/Tooltip";

const MakerNoteAccordionItem = ({
  mnoteData,
}: {
  mnoteData: ExifMnoteData;
}) => {
  const { locale } = useLocale();
  return (
    <AccordionItem id="MAKERNOTE">
      <AccordionHeader>
        <div className="flex gap-2">
          Makernote
          <Badge>
            {formatPlural(
              mnoteData.dataCount,
              {
                one: " tag",
                other: " tags",
              },
              locale,
            )}
          </Badge>
        </div>
      </AccordionHeader>
      <AccordionPanel>
        <DataList variant="bold">
          {mnoteData.data.map((mnoteDatum, index) => (
            <DataListItem
              className="flex-col! md:flex-row!"
              key={index} // id is not unique
            >
              <DataListItemLabel className="md:w-1/3">
                {mnoteDatum.description !== null &&
                mnoteDatum.description !== "" ? (
                  <TooltipTrigger>
                    <TooltipTarget>
                      <span role="button">{mnoteDatum.title}</span>
                    </TooltipTarget>
                    <Tooltip>{mnoteDatum.description}</Tooltip>
                  </TooltipTrigger>
                ) : (
                  (mnoteDatum.title ??
                  mnoteDatum.name ??
                  `ID ${mnoteDatum.id} (${index})`)
                )}
              </DataListItemLabel>
              <DataListItemValue className="relative before:relative before:left-0 before:pr-1.5 before:text-fg-muted before:content-['=']">
                {mnoteDatum.value}
              </DataListItemValue>
            </DataListItem>
          ))}
        </DataList>
      </AccordionPanel>
    </AccordionItem>
  );
};

export { MakerNoteAccordionItem };
