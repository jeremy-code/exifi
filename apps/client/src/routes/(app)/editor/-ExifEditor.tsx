import { Suspense, type ComponentPropsWithRef } from "react";

import { ArrowLeft } from "lucide-react";
import { cn } from "tailwind-variants";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileInformation } from "#components/file/FileInformation";
import { useDropzoneState } from "#hooks/useDropzoneState";
import { useExifEditor, ExifEditorStoreContext } from "#hooks/useExifEditor";
import { saveFile } from "#utils/saveFile";
import { Button } from "@exiftools/ui/components/Button";
import { Skeleton } from "@exiftools/ui/components/Skeleton";
import { writeExifData } from "@exiftools/write-exif-data";

import { ExifEditorIfd } from "./-ExifEditorIfd";

type ExifEditorProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifEditor = ({ file, className, ...props }: ExifEditorProps) => {
  const { exifData, exifEditorStore } = useExifEditor(file);
  const fix = useStore(exifEditorStore, (state) => state.fix);
  const addImageDimensions = useStore(
    exifEditorStore,
    (state) => state.addImageDimensions,
  );

  const [removeAcceptedFileByIndex, replaceAcceptedFileByIndex] =
    useDropzoneState(
      useShallow((state) => [
        state.removeAcceptedFileByIndex,
        state.replaceAcceptedFileByIndex,
      ]),
    );

  return (
    <Suspense fallback={<Skeleton className="h-50" />}>
      <ExifEditorStoreContext value={exifEditorStore}>
        <div className={cn("flex flex-col gap-4", className)} {...props}>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => removeAcceptedFileByIndex(0)}
            >
              <ArrowLeft className="size-[1em]" />
              Upload different image
            </Button>
            <Button
              onClick={async () => {
                if (exifData === null) {
                  throw new Error("Reference to ExifData instance not found");
                }
                const newFileInBytes = writeExifData(
                  await file.bytes(),
                  exifData.saveData(),
                );
                const newFile = new File(
                  [new Uint8Array(newFileInBytes)],
                  file.name,
                  { type: file.type, lastModified: new Date().getTime() },
                );
                await saveFile(newFile);
                replaceAcceptedFileByIndex(0, newFile);
              }}
            >
              Export
            </Button>
            <Button
              onClick={() => {
                fix();
              }}
            >
              Fix
            </Button>
            <Button
              onClick={() => {
                if (exifData === null) {
                  console.log("is null");
                }
                exifData?.dump();
              }}
            >
              Dump
            </Button>
            <Button
              onClick={async () => {
                await addImageDimensions();
              }}
            >
              Add image dimensions
            </Button>
          </div>
          <FileInformation file={file} />
          <ExifEditorIfd />
        </div>
      </ExifEditorStoreContext>
    </Suspense>
  );
};

export { ExifEditor };
