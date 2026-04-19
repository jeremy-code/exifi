import { Suspense, useTransition, type ComponentPropsWithRef } from "react";

import { Save } from "lucide-react";
import { cn } from "tailwind-variants";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileInformation } from "#components/file/FileInformation";
import { useExifEditor, ExifEditorStoreContext } from "#hooks/useExifEditor";
import { useFileStore } from "#hooks/useFileStore";
import { saveFile } from "#utils/saveFile";
import { Button } from "@exiftools/ui/components/Button";
import { Skeleton } from "@exiftools/ui/components/Skeleton";
import { Spinner } from "@exiftools/ui/components/Spinner";
import { writeExifData } from "@exiftools/write-exif-data";

import { ExifEditorIfd } from "./-ExifEditorIfd";

const ExifEditorApp = ({ file }: { file: File }) => {
  const { exifData, exifEditorStore } = useExifEditor(file);
  const [fix, addImageDimensions] = useStore(
    exifEditorStore,
    useShallow((state) => [state.fix, state.addImageDimensions]),
  );
  const { setFile } = useFileStore();
  const [isPending, startTransition] = useTransition();

  return (
    <ExifEditorStoreContext value={exifEditorStore}>
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={isPending}
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
            startTransition(() => setFile(newFile));
            void saveFile(newFile);
          }}
        >
          {isPending && <Spinner className="absolute" />}
          <span
            className="inline-flex items-center gap-2 data-[pending=true]:invisible"
            data-pending={isPending}
          >
            <Save size={16} />
            Save
          </span>
        </Button>
        <Button onClick={() => fix()}>Fix</Button>
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
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <FileInformation file={file} />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
        <ExifEditorApp file={file} />
      </Suspense>
    </div>
  );
};

export { ExifEditor };
