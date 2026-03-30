import { Suspense, useMemo, useState, type ComponentPropsWithRef } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ExifData } from "libexif-wasm";
import { ArrowLeft } from "lucide-react";
import { cn } from "tailwind-variants";
import { useStore } from "zustand";

import { FileInformation } from "#components/file/FileInformation";
import { useDropzoneState } from "#hooks/useDropzoneState";
import {
  createExifEditorState,
  ExifEditorStateStoreContext,
} from "#hooks/useExifEditorState";
import { deserializeExifData } from "#lib/exif/deserializeExifData";
import { serializeExifData } from "#lib/exif/serializeExifData";
import { saveFile } from "#utils/saveFile";
import { Button } from "@exiftools/ui/components/Button";
import { Skeleton } from "@exiftools/ui/components/Skeleton";
import { writeExifData } from "@exiftools/write-exif-data";

import { ExifEditorIfd } from "./-ExifEditorIfd";

type ExifEditorProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifEditor = ({ file, className, ...props }: ExifEditorProps) => {
  const { data: arrayBuffer } = useSuspenseQuery({
    queryKey: [file] as const,
    queryFn: ({ queryKey: [file] }) => file.arrayBuffer(),
  });
  const initialExifDataObject = useMemo(() => {
    const exifData = ExifData.from(arrayBuffer);
    const exifDataObject = serializeExifData(exifData);
    exifData.free();
    return exifDataObject;
  }, [arrayBuffer]);
  const [store] = useState(() => createExifEditorState(initialExifDataObject));
  const exifDataObject = useStore(store, (state) => state.exifDataObject);
  const removeAcceptedFileByIndex = useDropzoneState(
    (state) => state.removeAcceptedFileByIndex,
  );

  return (
    <Suspense fallback={<Skeleton className="h-50" />}>
      <ExifEditorStateStoreContext value={store}>
        <div className={cn("flex flex-col gap-4", className)} {...props}>
          <div>
            <Button
              variant="ghost"
              onClick={() => removeAcceptedFileByIndex(0)}
            >
              <ArrowLeft className="size-[1em]" />
              Upload different image
            </Button>
            <Button
              onClick={async () => {
                const exifData = deserializeExifData(exifDataObject);
                const newFileInBytes = writeExifData(
                  await file.bytes(),
                  exifData.saveData(),
                );
                const newFile = new File(
                  [new Uint8Array(newFileInBytes)],
                  file.name,
                  { type: file.type, lastModified: new Date().getTime() },
                );
                exifData.free();
                await saveFile(newFile);
              }}
            >
              Export
            </Button>
          </div>
          <FileInformation file={file} />
          <ExifEditorIfd
            exifEntryObjects={Object.values(exifDataObject.ifd).flat()}
          />
        </div>
      </ExifEditorStateStoreContext>
    </Suspense>
  );
};

export { ExifEditor };
