import { Suspense, useMemo, type ComponentPropsWithRef } from "react";

import { imageDimensionsFromStream } from "image-dimensions";
import type { ExifData } from "libexif-wasm";
import { cn } from "tailwind-variants";

import { useObjectUrl } from "#hooks/useObjectUrl";
import { m } from "#paraglide/messages";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exifi/ui/components/Card";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";
import { Link } from "@exifi/ui/components/Link";
import { Skeleton } from "@exifi/ui/components/Skeleton";

import { ExifDateTimeInformation } from "./ExifDateTimeInformation";
import { ImageDimensions } from "./ImageDimensions";

const ExifThumbnailInformation = ({ thumbnail }: { thumbnail: Uint8Array }) => {
  const blob = useMemo(
    () => new Blob([thumbnail.slice()], { type: "image/jpeg" }),
    [thumbnail],
  );
  const blobUrl = useObjectUrl(blob);
  const imageDimensionsPromise = useMemo(
    () => imageDimensionsFromStream(blob.stream()),
    [blob],
  );

  return (
    <Suspense fallback={<Skeleton className="h-[1em] w-15" />}>
      <Link className="inline" href={blobUrl} underline>
        <ImageDimensions imageDimensionsPromise={imageDimensionsPromise} />
      </Link>
    </Suspense>
  );
};

type ExifInformationProps = {
  exifData: ExifData;
} & ComponentPropsWithRef<typeof Card>;

const ExifInformation = ({
  exifData,
  className,
  ...props
}: ExifInformationProps) => {
  return (
    <Card className={cn("max-w-full min-w-0", className)} {...props}>
      <CardHeader>
        <CardTitle>{m.files_exif_info_title()}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DataList
          orientation="vertical"
          variant="bold"
          className="grid grid-cols-[repeat(auto-fit,minmax(--spacing(35),1fr))]"
        >
          <DataListItem>
            <DataListItemLabel className="min-w-[unset]">
              {m.files_exif_info_byte_order()}
            </DataListItemLabel>
            <DataListItemValue>
              {m.files_exif_byte_order({ byteOrder: exifData.byteOrder })}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-[unset]">
              {m.files_exif_info_data_type()}
            </DataListItemLabel>
            <DataListItemValue>
              {m.files_exif_data_type({ dataType: exifData.dataType })}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-[unset]">
              {m.files_exif_info_makernote()}
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.mnoteData !== null
                ? m.files_exif_info_makernote_entries({
                    count: exifData.mnoteData.dataCount,
                  })
                : exifData.getEntry("MAKER_NOTE") !== null
                  ? m.files_exif_info_makernote_unable_to_parse()
                  : m.files_does_not_exist()}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-[unset]">
              {m.files_exif_info_thumbnail()}
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.data.length !== 0 ? (
                <ExifThumbnailInformation thumbnail={exifData.data} />
              ) : (
                m.files_does_not_exist()
              )}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-[unset]">
              {m.files_exif_info_number_of_entries()}
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.ifd.reduce(
                (acc, value) => acc + value.entries.length,
                0,
              )}
            </DataListItemValue>
          </DataListItem>
          <ExifDateTimeInformation exifData={exifData} />
        </DataList>
      </CardContent>
    </Card>
  );
};

export { ExifInformation, type ExifInformationProps };
