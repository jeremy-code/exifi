import type { ComponentPropsWithRef } from "react";

import { formatBytes } from "#utils/formatBytes";
import { Badge } from "@exiftools/ui/components/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exiftools/ui/components/Card";
import { Link } from "@exiftools/ui/components/Link";

type FileInformationProps = { file: File } & ComponentPropsWithRef<"div">;

const FileInformation = ({ file, ...props }: FileInformationProps) => {
  const objectUrl = URL.createObjectURL(file);

  return (
    <div className="grid max-w-full gap-4 md:grid-cols-[auto_1fr]" {...props}>
      <Card className="grid place-content-center md:h-0 md:min-h-full">
        <img
          className="max-h-80 p-6"
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
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">
              File name
            </p>
            <Link
              onClick={() => {
                const objectUrl = URL.createObjectURL(file);
                window.open(objectUrl);
                URL.revokeObjectURL(objectUrl);
              }}
              className="cursor-pointer"
              underline
            >
              {file.name}
            </Link>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">
              File size
            </p>
            <p>{formatBytes(file.size)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">
              Last modified
            </p>
            <p>
              {new Date(file.lastModified).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">
              MIME type
            </p>
            <div>
              <Badge className="select-auto">
                {file.type !== "" ? file.type : "Unknown"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { FileInformation, type FileInformationProps };
