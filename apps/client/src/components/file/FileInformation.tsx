import { Suspense, use, useMemo, type ComponentPropsWithRef } from "react";

import dayjs from "dayjs";
import { cn } from "tailwind-variants";

import { useFileHash } from "#hooks/useFileHash";
import { useObjectUrl } from "#hooks/useObjectUrl";
import { formatBytes } from "#utils/formatBytes";
import { getImageDimensions } from "#utils/getImageDimensions";
import { Badge } from "@exifi/ui/components/Badge";
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
  type DataListItemValueProps,
} from "@exifi/ui/components/DataList";
import { Link } from "@exifi/ui/components/Link";
import { Skeleton } from "@exifi/ui/components/Skeleton";

const FileDimensionsInformation = ({
  fileDimensionsPromise,
  ...props
}: {
  fileDimensionsPromise: Promise<{ width: number; height: number }>;
} & DataListItemValueProps) => {
  const fileDimensions = use(fileDimensionsPromise);

  return (
    <DataListItemValue {...props}>
      {fileDimensions.width !== 0 && fileDimensions.height !== 0 ?
        `${fileDimensions?.width}px \u00d7 ${fileDimensions?.height}px`
      : "Unknown"}
    </DataListItemValue>
  );
};

const FileHashInformation = ({
  file,
  ...props
}: { file: File } & DataListItemValueProps) => {
  const fileHash = useFileHash(file);
  return (
    <DataListItemValue {...props}>{fileHash ?? "Unknown"}</DataListItemValue>
  );
};

type FileInformationProps = { file: File } & ComponentPropsWithRef<"div">;

const FileInformation = ({
  file,
  className,
  ...props
}: FileInformationProps) => {
  const objectUrl = useObjectUrl(file);
  const fileDimensionsPromise = useMemo(() => getImageDimensions(file), [file]);

  return (
    <div
      className={cn("grid gap-4 md:grid-cols-[1fr_2fr]", className)}
      {...props}
    >
      <Card
        className="overflow-auto bg-size-[var(--checker-size)_var(--checker-size)] [--checker-size:--spacing(5)] md:h-0 md:min-h-full"
        style={{
          // https://css-tricks.com/background-patterns-simplified-by-conic-gradients/#aa-checkerboard
          backgroundImage:
            "repeating-conic-gradient(var(--color-gray-300) 0 25%, var(--color-white) 0 50%)",
        }}
      >
        <img
          className="m-auto size-full object-scale-down max-md:max-w-xs"
          // MDN calls revoking object URL on load an anti-pattern
          // https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob#memory_management
          src={objectUrl}
        />
      </Card>
      <Card className="max-w-full min-w-0">
        <CardHeader>
          <CardTitle>File information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <DataList orientation="vertical" variant="bold">
            <DataListItem>
              <DataListItemLabel>File</DataListItemLabel>
              <DataListItemValue className="flex-wrap gap-2">
                <Link
                  className="line-clamp-1 cursor-pointer wrap-break-word break-all"
                  underline
                  href={objectUrl}
                >
                  {file.name}
                </Link>
                <Badge className="select-auto">
                  {file.type !== "" ? file.type : "Unknown"}
                </Badge>
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
              <DataListItemLabel>Dimensions</DataListItemLabel>
              <Suspense fallback={<Skeleton className="h-5 w-20" />}>
                <FileDimensionsInformation
                  fileDimensionsPromise={fileDimensionsPromise}
                />
              </Suspense>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel>File hash (SHA-256)</DataListItemLabel>
              <Suspense fallback={<Skeleton className="h-5 w-60" />}>
                <FileHashInformation
                  className="block overflow-hidden text-ellipsis"
                  file={file}
                />
              </Suspense>
            </DataListItem>
          </DataList>
        </CardContent>
      </Card>
    </div>
  );
};

export { FileInformation, type FileInformationProps };
