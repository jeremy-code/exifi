import { Suspense, type ComponentPropsWithRef } from "react";

import { imageDimensionsFromStream } from "image-dimensions";
import { type ExifData } from "libexif-wasm";
import { cn } from "tailwind-variants";

import { useObjectUrl } from "#hooks/useObjectUrl";
import { m } from "#paraglide/messages";
import { DATA_TYPE_MAP } from "@exifi/core/exif/constants";
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
import { assertNever } from "@exifi/utils/assertNever";

import { ExifDateTimeInformation } from "./ExifDateTimeInformation";
import { ImageDimensions } from "./ImageDimensions";

type ExifInformationProps = {
  exifData: ExifData;
} & ComponentPropsWithRef<typeof Card>;

const ExifInformation = ({
  exifData,
  className,
  ...props
}: ExifInformationProps) => {
  const blob = new Blob([new Uint8Array(exifData.data)]);
  const blobUrl = useObjectUrl(blob);
  const imageDimensionsPromise = imageDimensionsFromStream(blob.stream());

  return (
    <Card className={cn("max-w-full min-w-0", className)} {...props}>
      <CardHeader>
        <CardTitle>{m["exifInformation.label"]()}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DataList
          orientation="vertical"
          variant="bold"
          className="grid grid-cols-[repeat(auto-fit,minmax(--spacing(35),1fr))]"
        >
          <DataListItem>
            <DataListItemLabel className="min-w-unset!">
              {m["exifInformation.byteOrder"]()}
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.byteOrder === "MOTOROLA"
                ? m["exifInformation.byteOrderBE"]()
                : exifData.byteOrder === "INTEL"
                  ? m["exifInformation.byteOrderLE"]()
                  : assertNever(exifData.byteOrder)}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              {m["exifInformation.dataType"]()}
            </DataListItemLabel>
            <DataListItemValue>
              {DATA_TYPE_MAP[exifData.dataType]}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              {m["exifInformation.makernote"]()}
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.mnoteData !== null
                ? m["exif.entry"]({ count: exifData.mnoteData.dataCount })
                : exifData.getEntry("MAKER_NOTE") !== null
                  ? m["exifInformation.makernoteUnparsed"]()
                  : m["exifInformation.makernoteNotFound"]()}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              {m["exifInformation.thumbnail"]()}
            </DataListItemLabel>
            <DataListItemValue className="inline">
              {exifData.data.length !== 0 ? (
                <Link href={blobUrl} color="blue">
                  <Suspense fallback={<Skeleton className="h-[1em] w-15" />}>
                    <ImageDimensions
                      imageDimensionsPromise={imageDimensionsPromise}
                    />
                  </Suspense>
                </Link>
              ) : (
                m["exifInformation.thumbnailNotFound"]()
              )}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              {m["exifInformation.numberOfEntries"]()}
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
