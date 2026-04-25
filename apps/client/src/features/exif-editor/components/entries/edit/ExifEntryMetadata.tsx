import type { ComponentPropsWithRef } from "react";

import {
  ExifTagInfo,
  exifIfdGetName,
  exifFormatGetName,
  exifFormatGetSize,
  exifSupportLevelGetName,
} from "libexif-wasm";
import { ChevronDown } from "lucide-react";

import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { formatPlural } from "#utils/formatPlural";
import { Button } from "@exifi/ui/components/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exifi/ui/components/Collapsible";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";

type ExifEntryMetadataProps = {
  exifEntryObject: ExifEntryObject;
} & ComponentPropsWithRef<typeof Collapsible>;

const ExifEntryMetadata = ({
  exifEntryObject,
  ...props
}: ExifEntryMetadataProps) => {
  return (
    <Collapsible {...props}>
      <DataList orientation="horizontal" variant="bold">
        <DataListItem>
          <DataListItemLabel className="min-w-50">Tag</DataListItemLabel>
          <DataListItemValue>
            {ExifTagInfo.getTitleInIfd(
              exifEntryObject.tag,
              exifEntryObject.ifd,
            )}
          </DataListItemValue>
        </DataListItem>
        <DataListItem>
          <DataListItemLabel className="min-w-50">Value</DataListItemLabel>
          <DataListItemValue>
            {exifEntryObject.formattedValue}
          </DataListItemValue>
        </DataListItem>
        <CollapsibleContent>
          <DataList>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                Tag description
              </DataListItemLabel>
              <DataListItemValue>
                {ExifTagInfo.getDescriptionInIfd(
                  exifEntryObject.tag,
                  exifEntryObject.ifd,
                )}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                Image File Directory
              </DataListItemLabel>
              <DataListItemValue>
                {exifIfdGetName(exifEntryObject.ifd)}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                Support level
              </DataListItemLabel>
              <DataListItemValue>
                {exifSupportLevelGetName(
                  ExifTagInfo.getSupportLevelInIfd(
                    exifEntryObject.tag,
                    exifEntryObject.ifd,
                  ),
                )}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">Format</DataListItemLabel>
              <DataListItemValue>
                {`${exifFormatGetName(exifEntryObject.format)} (${formatPlural(
                  exifFormatGetSize(exifEntryObject.format),
                  { one: " byte", other: " bytes" },
                )})`}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                Components
              </DataListItemLabel>
              <DataListItemValue>
                {`${formatPlural(exifEntryObject.components, {
                  one: " component",
                  other: " components",
                })} (${formatPlural(exifEntryObject.size, {
                  one: " byte",
                  other: " bytes",
                })} in total)`}
              </DataListItemValue>
            </DataListItem>
          </DataList>
        </CollapsibleContent>
      </DataList>
      <CollapsibleTrigger asChild>
        <Button className="group/collapsible-trigger mt-4" variant="muted">
          <ChevronDown
            size={16}
            className="transition-transform data-[open=true]:rotate-180"
          />
          <span className="group-data-[state=closed]/collapsible-trigger:hidden">
            See less
          </span>
          <span className="group-data-[state=open]/collapsible-trigger:hidden">
            See more
          </span>
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export { ExifEntryMetadata, type ExifEntryMetadataProps };
