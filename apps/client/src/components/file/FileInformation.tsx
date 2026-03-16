import type { ComponentPropsWithRef } from "react";

import { formatBytes } from "#utils/formatBytes";
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
} from "@exiftools/ui/components/DataList";
import { Link } from "@exiftools/ui/components/Link";

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
                <time dateTime={new Date(file.lastModified).toISOString()}>
                  {new Date(file.lastModified).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
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
          </DataList>
        </CardContent>
      </Card>
    </div>
  );
};

export { FileInformation, type FileInformationProps };
