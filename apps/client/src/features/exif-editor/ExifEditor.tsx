import { Suspense, type ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { FileInformation } from "#components/file/FileInformation";
import { Skeleton } from "@exifi/ui/components/Skeleton";

import { ExifEditorProvider } from "./ExifEditorProvider";
import { ExifInspector } from "./components/ExifInspector";
import { ExifTable } from "./components/ExifTable";
import { ExifToolbar } from "./components/ExifToolbar";

type ExifEditorProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifEditor = ({ file, className, ...props }: ExifEditorProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <FileInformation file={file} />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
        <ExifEditorProvider>
          <ExifInspector />
          <ExifToolbar />
          <ExifTable />
        </ExifEditorProvider>
      </Suspense>
    </div>
  );
};

export { ExifEditor };
