import { Suspense, type ComponentPropsWithRef } from "react";

import { ArrowLeft, Save } from "lucide-react";
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

const ExifEditorApp = ({ file }: { file: File }) => {
  const { exifData, exifEditorStore } = useExifEditor(file);
  const [fix, addImageDimensions] = useStore(
    exifEditorStore,
    useShallow((state) => [state.fix, state.addImageDimensions]),
  );
  const replaceAcceptedFileByIndex = useDropzoneState(
    (state) => state.replaceAcceptedFileByIndex,
  );

  return (
    <ExifEditorStoreContext value={exifEditorStore}>
      <div className="flex gap-2">
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
          <Save size={16} />
          Save
        </Button>
        <Button onClick={() => fix()}>Fix</Button>
        <Button
          onClick={() => {
            if (exifData === null) {
              throw new Error("Reference to ExifData instance not found");
            }
            exifData.dump();
          }}
        >
          Dump
        </Button>
        <Button onClick={() => addImageDimensions()}>
          Add image dimensions
        </Button>
      </div>
      <ExifEditorIfd />
    </ExifEditorStoreContext>
  );
};

type ExifEditorProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifEditor = ({ file, className, ...props }: ExifEditorProps) => {
  const removeAcceptedFileByIndex = useDropzoneState(
    (state) => state.removeAcceptedFileByIndex,
  );

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div>
        <Button variant="ghost" onClick={() => removeAcceptedFileByIndex(0)}>
          <ArrowLeft className="size-[1em]" />
          Upload different image
        </Button>
      </div>
      <FileInformation file={file} />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
        <ExifEditorApp file={file} />
      </Suspense>
    </div>
  );
};

export { ExifEditor };
