import { Suspense, useMemo, type ComponentPropsWithRef } from "react";

import { imageDimensionsFromStream } from "image-dimensions";
import { type ExifData } from "libexif-wasm";
import { useLocale } from "react-aria/I18nProvider";

import { useObjectUrl } from "#hooks/useObjectUrl";
import { formatPlural } from "#utils/format/formatPlural";
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

const ExifThumbnailInformation = ({ thumbnail }: { thumbnail: Uint8Array }) => {
  const blob = useMemo(
    () => new Blob([new Uint8Array(thumbnail)]),
    [thumbnail],
  );
  const blobUrl = useObjectUrl(blob);
  const imageDimensionsPromise = useMemo(
    () => imageDimensionsFromStream(blob.stream()),
    [blob],
  );

  return (
    <>
      <Link href={blobUrl} color="blue">
        Exists
      </Link>{" "}
      <Suspense fallback={<Skeleton className="h-[1em] w-15" />}>
        (<ImageDimensions imageDimensionsPromise={imageDimensionsPromise} />)
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
  const { locale } = useLocale();

  return (
    <Card className="max-w-full min-w-0" {...props}>
      <CardHeader>
        <CardTitle>Exif information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DataList
          orientation="vertical"
          variant="bold"
          className="grid grid-cols-[repeat(auto-fit,minmax(--spacing(35),1fr))]"
        >
          <DataListItem>
            <DataListItemLabel className="min-w-unset!">
              Byte order
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.byteOrder === "MOTOROLA"
                ? "Big-endian"
                : exifData.byteOrder === "INTEL"
                  ? "Little-endian"
                  : assertNever(exifData.byteOrder)}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Data type
            </DataListItemLabel>
            <DataListItemValue>
              {DATA_TYPE_MAP[exifData.dataType]}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Makernote
            </DataListItemLabel>
            <DataListItemValue>
              {exifData.mnoteData !== null
                ? formatPlural(
                    exifData.mnoteData.dataCount,
                    {
                      one: " entry",
                      other: " entries",
                    },
                    locale,
                  )
                : exifData.getEntry("MAKER_NOTE") !== null
                  ? "Unable to parse"
                  : "Does not exist"}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-unset">
              Thumbnail
            </DataListItemLabel>
            <DataListItemValue className="inline">
              {exifData.data.length !== 0 ? (
                <ExifThumbnailInformation thumbnail={exifData.data} />
              ) : (
                "Does not exist"
              )}
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
          <ExifDateTimeInformation exifData={exifData} />
        </DataList>
      </CardContent>
    </Card>
  );
};

export { ExifInformation, type ExifInformationProps };
