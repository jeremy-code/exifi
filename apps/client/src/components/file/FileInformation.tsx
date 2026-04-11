import { Suspense, type ComponentPropsWithRef } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { formatBytes } from "#utils/formatBytes";
import { getImageDimensions } from "#utils/getImageDimensions";
import { Badge } from "@exiftools/ui/components/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exiftools/ui/components/Card";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  type DataListItemValueProps,
} from "@exiftools/ui/components/DataList";
import { Link } from "@exiftools/ui/components/Link";
import { Skeleton } from "@exiftools/ui/components/Skeleton";

const FileDimensionsInformation = ({
  file,
  ...props
}: { file: File } & DataListItemValueProps) => {
  const { data: dimensions } = useSuspenseQuery({
    queryKey: [
      "FileDimensionsInformation",
      {
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath,
        lastModified: file.lastModified,
      },
      file,
    ],
    queryFn: () => getImageDimensions(file),
  });

  return (
    <DataListItemValue {...props}>
      {dimensions?.width} x {dimensions?.height}
    </DataListItemValue>
  );
};

type FileInformationProps = { file: File } & ComponentPropsWithRef<"div">;

const FileInformation = ({ file, ...props }: FileInformationProps) => {
  const objectUrl = URL.createObjectURL(file);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_2fr]" {...props}>
      <Card
        className="overflow-auto [--checker-size:--spacing(5)] md:h-0 md:min-h-full"
        style={{
          // https://css-tricks.com/background-patterns-simplified-by-conic-gradients/#aa-checkerboard
          backgroundImage:
            "repeating-conic-gradient(var(--color-gray-300) 0 25%, var(--color-white) 0 50%)",
          backgroundSize: "var(--checker-size) var(--checker-size)",
        }}
      >
        <img
          className="m-auto size-full object-scale-down max-md:max-w-xs"
          src={objectUrl}
          onLoad={() => {
            URL.revokeObjectURL(objectUrl);
          }}
        />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>File information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <DataList orientation="vertical" variant="bold">
            <DataListItem>
              <DataListItemLabel>File name</DataListItemLabel>
              <DataListItemValue>
                <Link
                  onClick={() => {
                    const objectUrl = URL.createObjectURL(file);
                    window.open(objectUrl);
                    URL.revokeObjectURL(objectUrl);
                  }}
                  className="cursor-pointer wrap-break-word break-all"
                  underline
                >
                  {file.name}
                </Link>
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel>File size</DataListItemLabel>
              <DataListItemValue>
                {formatBytes(file.size, undefined, {
                  maximumFractionDigits: 1,
                })}
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel>Last modified</DataListItemLabel>
              <DataListItemValue>
                <time dateTime={dayjs(file.lastModified).toISOString()}>
                  {dayjs(file.lastModified).format("YYYY MMM D, h:mmA")}
                </time>
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel>MIME type</DataListItemLabel>
              <DataListItemValue>
                <Badge className="select-auto">
                  {file.type !== "" ? file.type : "Unknown"}
                </Badge>
              </DataListItemValue>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel>Dimensions</DataListItemLabel>
              <Suspense fallback={<Skeleton className="h-5 w-20" />}>
                <FileDimensionsInformation file={file} />
              </Suspense>
            </DataListItem>
          </DataList>
        </CardContent>
      </Card>
    </div>
  );
};

export { FileInformation, type FileInformationProps };
