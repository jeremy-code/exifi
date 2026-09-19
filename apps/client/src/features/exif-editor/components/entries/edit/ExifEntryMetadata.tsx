import {
  ExifTagInfo,
  exifIfdGetName,
  exifFormatGetName,
  exifFormatGetSize,
  exifSupportLevelGetName,
} from "libexif-wasm";
import { ChevronDown } from "lucide-react";
import {
  Disclosure,
  type DisclosureProps,
  DisclosurePanel,
  Heading,
} from "react-aria-components/Disclosure";
import { useLocale } from "react-aria/I18nProvider";
import { useNumberFormatter } from "react-aria/useNumberFormatter";

import { m } from "#paraglide/messages";
import { formatPlural } from "#utils/formatPlural";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { getEntryObjectLabel } from "@exifi/core/exif/utils/getEntryObjectLabel";
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
  const { locale } = useLocale();
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
            {m.fair_livid_llama_support()}
          </DataListItemLabel>
          <DataListItemValue>
            {getEntryObjectLabel(exifEntryObject)}
          </DataListItemValue>
        </DataListItem>
        <DataListItem>
          <DataListItemLabel className="min-w-50">
            {m.silly_close_chipmunk_twirl()}
          </DataListItemLabel>
          <DataListItemValue>
            {exifEntryObject.formattedValue}
          </DataListItemValue>
        </DataListItem>
        <DisclosurePanel>
          <DataList>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.bold_happy_giraffe_talk()}
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
                {m.maroon_front_flea_pick()}
              </DataListItemLabel>
              <DataListItemValue>
                {exifIfdGetName(exifEntryObject.ifd)}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.weak_zippy_koala_surge()}
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
              <DataListItemLabel className="min-w-50">
                {m.grassy_kind_mantis_propel()}
              </DataListItemLabel>
              <DataListItemValue>
                {`${exifFormatGetName(exifEntryObject.format)} (${byteNumberFormatter.format(
                  exifFormatGetSize(exifEntryObject.format),
                )})`}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel className="min-w-50">
                {m.aware_slow_wren_dart()}
              </DataListItemLabel>
              <DataListItemValue>
                {`${formatPlural(
                  exifEntryObject.components,
                  { one: " component", other: " components" },
                  locale,
                )} (${byteNumberFormatter.format(
                  exifEntryObject.size,
                )} in total)`}
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
          <ChevronDown
            size={16}
            className="transition-transform group-aria-expanded/collapsible-trigger:rotate-180"
          />
          <span className="group-aria-[expanded=false]/collapsible-trigger:hidden">
            {m.vivid_quiet_lobster_leap()}
          </span>
          <span className="group-aria-expanded/collapsible-trigger:hidden">
            {m.patchy_slimy_crow_empower()}
          </span>
        </Button>
      </Heading>
    </Disclosure>
  );
};

export { ExifEntryMetadata, type ExifEntryMetadataProps };
