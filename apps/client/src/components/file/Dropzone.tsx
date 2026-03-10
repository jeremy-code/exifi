import { FileIcon, FileUp, X } from "lucide-react";
import { AccessibleIcon } from "radix-ui";
import {
  useDropzone,
  type DropzoneInputProps,
  type DropzoneOptions,
} from "react-dropzone";
import { cn } from "tailwind-variants";

import { useDropzoneState } from "#hooks/useDropzoneState";
import { formatBytes } from "#utils/formatBytes";
import { Button } from "@exiftools/ui/components/Button";
import { Link } from "@exiftools/ui/components/Link";

type AcceptedFileProps = {
  file: File;
  index: number;
};

const AcceptedFile = ({ file, index }: AcceptedFileProps) => {
  const removeAcceptedFileByIndex = useDropzoneState(
    (state) => state.removeAcceptedFileByIndex,
  );

  return (
    <li className="flex justify-between gap-3 rounded border bg-muted p-3 text-muted-foreground">
      <div className="grid aspect-square place-content-center">
        <FileIcon className="size-[1em]" />
      </div>
      <div className="grow">
        <p className="line-clamp-1 text-sm font-semibold">{file.name}</p>
        <p className="text-xs text-subtle-foreground">
          {formatBytes(file.size, undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="grid aspect-square place-content-center">
        <Button
          size="icon"
          onClick={() => {
            removeAcceptedFileByIndex(index);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </li>
  );
};

type DropzoneProps = {
  dropzoneOptions?: DropzoneOptions;
  inputProps?: DropzoneInputProps;
};

const Dropzone = ({ dropzoneOptions, inputProps }: DropzoneProps) => {
  const acceptedFiles = useDropzoneState((state) => state.acceptedFiles);
  const addAcceptedFiles = useDropzoneState((state) => state.addAcceptedFiles);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    open,
    fileRejections,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    ...dropzoneOptions,
    onDropAccepted: (files, event) => {
      addAcceptedFiles(files);
      dropzoneOptions?.onDropAccepted?.(files, event);
    },
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "flex flex-col items-center gap-6 rounded border border-dashed p-6 text-muted-foreground",
          {
            "border-red-600 bg-red-600/10": fileRejections.length > 0,
            "border-blue-600 bg-blue-600/10": isDragAccept,
          },
        ),
      })}
    >
      <div className="inline-flex grow flex-row items-center justify-normal gap-2">
        <AccessibleIcon.Root label="Upload file">
          <FileUp />
        </AccessibleIcon.Root>
        {isDragActive ?
          <div>Drop a file here</div>
        : <div>
            {"Drag a file here or "}
            <Link color="link" underline="hover" asChild>
              <button
                type="button"
                className="cursor-pointer appearance-none select-text"
                onClick={open}
              >
                upload a file
              </button>
            </Link>
          </div>
        }
      </div>
      <input {...getInputProps(inputProps)} />
      {acceptedFiles.length !== 0 && (
        <li className="flex w-full flex-col gap-2">
          {acceptedFiles.map((file, index) => (
            <AcceptedFile
              key={`${file.name}-${file.lastModified}-${file.size}`}
              file={file}
              index={index}
            />
          ))}
        </li>
      )}
    </div>
  );
};

export { Dropzone, type DropzoneProps };
