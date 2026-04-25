import type { ComponentPropsWithRef, RefObject } from "react";

import { Clapperboard, File, FileUp, Image, Music, X } from "lucide-react";
import { AccessibleIcon } from "radix-ui";
import {
  useDropzone,
  type DropzoneInputProps,
  type DropzoneOptions,
} from "react-dropzone";
import { cn } from "tailwind-variants";
import { useShallow } from "zustand/react/shallow";

import { useDropzoneStore } from "#hooks/useDropzoneStore";
import { formatBytes } from "#utils/formatBytes";
import { Button } from "@exifi/ui/components/Button";
import { Link } from "@exifi/ui/components/Link";

type AcceptedFileProps = {
  file: File;
  removeFile: () => void;
} & ComponentPropsWithRef<"li">;

const AcceptedFile = ({
  className,
  file,
  removeFile,
  ...props
}: AcceptedFileProps) => {
  const AcceptedFileIcon =
    file.type.startsWith("image/") ? Image
    : file.type.startsWith("video/") ? Clapperboard
    : file.type.startsWith("audio/") ? Music
    : File;

  return (
    <li
      className={cn(
        "flex max-w-full justify-between gap-3 rounded border bg-muted p-3 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <div
        className="grid aspect-square place-content-center rounded border bg-subtle"
        aria-hidden={true}
      >
        <AcceptedFileIcon className="size-[1.25em]" />
      </div>
      <div className="min-w-0 grow">
        <p className="line-clamp-1 font-mono text-sm font-semibold text-ellipsis">
          {file.name}
        </p>
        <p className="text-xs text-subtle-foreground">
          {formatBytes(file.size, undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="grid aspect-square place-content-center">
        <Button
          size="icon"
          onClick={() => {
            removeFile();
          }}
        >
          <AccessibleIcon.Root label="Remove file">
            <X className="size-4" />
          </AccessibleIcon.Root>
        </Button>
      </div>
    </li>
  );
};

type DropzoneProps = {
  dropzoneOptions?: DropzoneOptions;
  inputProps?: DropzoneInputProps;
  rootProps?: ComponentPropsWithRef<"div">;
};

const Dropzone = ({
  dropzoneOptions,
  inputProps,
  rootProps,
}: DropzoneProps) => {
  const { acceptedFiles, addAcceptedFiles, removeAcceptedFileByIndex } =
    useDropzoneStore(
      useShallow((state) => ({
        acceptedFiles: state.acceptedFiles,
        addAcceptedFiles: state.addAcceptedFiles,
        removeAcceptedFileByIndex: state.removeAcceptedFileByIndex,
      })),
    );
  const {
    open,
    isDragActive,
    isDragAccept,
    fileRejections,
    rootRef,
    inputRef,
    getRootProps,
    getInputProps,
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
      ref={rootRef as RefObject<HTMLDivElement>}
      {...getRootProps({
        ...rootProps,
        className: cn(
          "flex flex-col items-center gap-6 rounded border border-dashed p-6 text-muted-foreground",
          {
            "border-destructive bg-destructive/10": fileRejections.length > 0,
            "border-accent bg-accent/10": isDragAccept,
          },
          rootProps?.className,
        ),
      })}
    >
      <div className="inline-flex grow flex-row items-center justify-normal gap-2 max-sm:text-sm">
        <AccessibleIcon.Root label="Upload file">
          <FileUp />
        </AccessibleIcon.Root>
        {isDragActive ?
          "Drop a file here"
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
      <input ref={inputRef} {...getInputProps(inputProps)} />
      {acceptedFiles.length > 0 && (
        <ol className="flex w-full flex-col gap-2">
          {acceptedFiles.map((file, index) => (
            <AcceptedFile
              // eslint-disable-next-line @eslint-react/no-array-index-key -- Using index since it is possible for the same file to uploaded more than once
              key={index}
              file={file}
              removeFile={() => removeAcceptedFileByIndex(index)}
            />
          ))}
        </ol>
      )}
    </div>
  );
};

export { Dropzone, type DropzoneProps };
