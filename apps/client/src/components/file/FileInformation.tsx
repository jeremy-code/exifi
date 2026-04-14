import { Suspense, type ComponentPropsWithRef } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { cn } from "tailwind-variants";

import { useFileHash } from "#hooks/useFileHash";
import { formatBytes } from "#utils/formatBytes";
import { getImageDimensions } from "#utils/getImageDimensions";
import { serializeFile } from "#utils/serializeFile";
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
import { toast } from "@exiftools/ui/hooks/useToast";

type FileInformationValueProps = { file: File } & DataListItemValueProps;

const FileDimensionsInformation = ({
  file,
  ...props
}: FileInformationValueProps) => {
  const { data: dimensions } = useSuspenseQuery({
    queryKey: ["FileDimensionsInformation", serializeFile(file), file],
    queryFn: () => getImageDimensions(file),
  });

  return (
    <DataListItemValue {...props}>
      {(
        dimensions !== undefined &&
        dimensions.width !== 0 &&
        dimensions.height !== 0
      ) ?
        `${dimensions?.width}px \u00d7 ${dimensions?.height}px`
      : "Unknown"}
    </DataListItemValue>
  );
};

const FileHashInformation = ({ file, ...props }: FileInformationValueProps) => {
  const { fileHash, isPending, error } = useFileHash(file);

  if (isPending) {
    return <Skeleton className="h-5 w-40" />;
  }

  if (error !== null) {
    toast({
      title: "Generating file hash failed",
      description: `Failed to generate hash for ${file.name}.`,
      variant: "destructive",
    });
  }

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
  const objectUrl = URL.createObjectURL(file);

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
              <DataListItemLabel>File</DataListItemLabel>
              <DataListItemValue className="gap-2">
                <Link
                  className="cursor-pointer wrap-break-word break-all"
                  asChild
                  underline
                >
                  <button
                    onClick={() => {
                      const objectUrl = URL.createObjectURL(file);
                      window.open(objectUrl);
                      URL.revokeObjectURL(objectUrl);
                    }}
                  >
                    {file.name}
                  </button>
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
                <FileDimensionsInformation file={file} />
              </Suspense>
            </DataListItem>
            <DataListItem>
              <DataListItemLabel>File hash (SHA-256)</DataListItemLabel>
              <FileHashInformation file={file} />
            </DataListItem>
          </DataList>
        </CardContent>
      </Card>
    </div>
  );
};

export { FileInformation, type FileInformationProps };
