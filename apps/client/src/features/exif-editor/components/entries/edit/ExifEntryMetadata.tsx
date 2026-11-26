import { ExifTagInfo, exifFormatGetSize } from "libexif-wasm";
import { ChevronDown } from "lucide-react";
import {
  Disclosure,
  type DisclosureProps,
  DisclosurePanel,
  Heading,
} from "react-aria-components/Disclosure";
import { useNumberFormatter } from "react-aria/useNumberFormatter";

import { getEntryLabel } from "#features/exif-editor/utils/getEntryLabel";
import {
  getExifFormatName,
  getExifIfdName,
  getExifSupportLevelName,
  getExifTagDescription,
} from "#lib/exif/labels";
import { m } from "#paraglide/messages";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { Button } from "@exifi/ui/components/Button";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";

type ExifEntryMetadataProps = {
  exifEntryObject: ExifEntryObject;
} & DisclosureProps;

const ExifEntryMetadata = ({
  exifEntryObject,
  ...props
}: ExifEntryMetadataProps) => {
  const byteNumberFormatter = useNumberFormatter({
    style: "unit",
    unit: "byte",
    unitDisplay: "long",
  });

  return (
    <Disclosure {...props}>
      <DataList orientation="horizontal" variant="bold">
        <DataListItem>
          <DataListItemLabel className="min-w-50">
            {m.editor_metadata_tag()}
          </DataListItemLabel>
          <DataListItemValue>
            {getEntryLabel(exifEntryObject)}
          </DataListItemValue>
        </DataListItem>
        <DataListItem>
          <DataListItemLabel className="min-w-50">
            {m.editor_metadata_value()}
          </DataListItemLabel>
          <DataListItemValue>
            {exifEntryObject.formattedValue}
          </DataListItemValue>
        </DataListItem>
        <DisclosurePanel>
          <DataList>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.editor_metadata_tag_description()}
              </DataListItemLabel>
              <DataListItemValue>
                {getExifTagDescription(
                  exifEntryObject.tag,
                  exifEntryObject.ifd,
                )}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.editor_metadata_ifd()}
              </DataListItemLabel>
              <DataListItemValue>
                {getExifIfdName(exifEntryObject.ifd)}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.editor_metadata_support_level()}
              </DataListItemLabel>
              <DataListItemValue>
                {getExifSupportLevelName(
                  ExifTagInfo.getSupportLevelInIfd(
                    exifEntryObject.tag,
                    exifEntryObject.ifd,
                  ),
                )}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.editor_metadata_format()}
              </DataListItemLabel>
              <DataListItemValue>
                {m.editor_metadata_format_value({
                  format: getExifFormatName(exifEntryObject.format),
                  size: byteNumberFormatter.format(
                    exifFormatGetSize(exifEntryObject.format),
                  ),
                })}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.editor_metadata_components()}
              </DataListItemLabel>
              <DataListItemValue>
                {m.editor_metadata_components_value({
                  count: exifEntryObject.components,
                  size: byteNumberFormatter.format(exifEntryObject.size),
                })}
              </DataListItemValue>
            </DataListItem>
          </DataList>
        </DisclosurePanel>
      </DataList>
      <Heading>
        <Button
          slot="trigger"
          className="group/collapsible-trigger mt-4"
          variant="muted"
        >
          <ChevronDown className="size-4 transition-transform group-aria-expanded/collapsible-trigger:rotate-180" />
          <span className="group-aria-[expanded=false]/collapsible-trigger:hidden">
            {m.editor_metadata_see_less()}
          </span>
          <span className="group-aria-expanded/collapsible-trigger:hidden">
            {m.editor_metadata_see_more()}
          </span>
        </Button>
      </Heading>
    </Disclosure>
  );
};

export { ExifEntryMetadata, type ExifEntryMetadataProps };
