import { Suspense, type ComponentPropsWithRef } from "react";

import type { DataType, ExifData } from "libexif-wasm";

import { useObjectUrl } from "#hooks/useObjectUrl";
import { assertNever } from "#utils/assertNever";
import { formatPlural } from "#utils/formatPlural";
import { getImageDimensions } from "#utils/getImageDimensions";
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

import { ImageDimensions } from "./ImageDimensions";

const dataTypeMap: Record<DataType, string> = {
  UNCOMPRESSED_CHUNKY: "Uncompressed chunky",
  UNCOMPRESSED_PLANAR: "Uncompressed planar",
  UNCOMPRESSED_YCC: "Uncompress YCC",
  COMPRESSED: "Compressed",
  UNKNOWN: "Unknown",
};

const ExifThumbnailInformation = ({ thumbnail }: { thumbnail: Uint8Array }) => {
  const blob = new Blob([new Uint8Array(thumbnail)]);
  const blobUrl = useObjectUrl(blob);

  return (
    <>
      <Link href={blobUrl} color="blue">
        Exists
      </Link>
      <Suspense fallback={<Skeleton className="h-[1em] w-[50px]" />}>
        (<ImageDimensions imageDimensionsPromise={getImageDimensions(blob)} />)
      </Suspense>
    </>
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
    <Card className="max-w-full min-w-0" {...props}>
      <CardHeader>
        <CardTitle>Exif information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DataList
          orientation="vertical"
          variant="bold"
          className="grid max-w-250 grid-cols-[repeat(auto-fit,minmax(--spacing(35),1fr))]"
        >
          <DataListItem>
            <DataListItemLabel className="min-w-unset!">
              Byte order
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.byteOrder === "MOTOROLA" ?
                "Big-endian"
              : exifData.byteOrder === "INTEL" ?
                "Little-endian"
              : assertNever(exifData.byteOrder)}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Data type
            </DataListItemLabel>
            <DataListItemValue>
              {dataTypeMap[exifData.dataType]}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Makernote data
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.mnoteData !== null ?
                formatPlural(exifData.mnoteData.dataCount, {
                  one: " entry",
                  other: " entries",
                })
              : exifData.getEntry("MAKER_NOTE") !== null ?
                "Unable to parse"
              : "Does not exist"}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Thumbnail
            </DataListItemLabel>
            <DataListItemValue className="gap-1">
              {exifData.data !== null ?
                <ExifThumbnailInformation thumbnail={exifData.data} />
              : "Does not exist"}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Number of entries
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.ifd.reduce(
                (acc, value) => acc + value.entries.length,
                0,
              )}
            </DataListItemValue>
          </DataListItem>
        </DataList>
      </CardContent>
    </Card>
  );
};

export { ExifInformation, type ExifInformationProps };
