import type { ComponentPropsWithRef, RefObject } from "react";

import { Clapperboard, File, FileUp, Image, Music, X } from "lucide-react";
import { Button as AriaButton } from "react-aria-components/Button";
import { useLocale } from "react-aria/I18nProvider";
import {
  useDropzone,
  type DropzoneInputProps,
  type DropzoneOptions,
} from "react-dropzone";
import { cn } from "tailwind-variants";
import { useShallow } from "zustand/react/shallow";

import { useDropzoneStore } from "#stores/dropzoneStore";
import { formatBytes } from "#utils/formatBytes";
import { Button } from "@exifi/ui/components/Button";
import { linkVariants } from "@exifi/ui/components/Link";

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
  const { locale } = useLocale();
  const AcceptedFileIcon = file.type.startsWith("image/")
    ? Image
    : file.type.startsWith("video/")
      ? Clapperboard
      : file.type.startsWith("audio/")
        ? Music
        : File;

  return (
    <li
      className={cn(
        "flex max-w-full justify-between gap-3 rounded border bg-bg-muted p-3 text-fg-muted",
        className,
      )}
      {...props}
    >
      <div
        className="grid aspect-square place-content-center rounded border bg-bg-subtle"
        aria-hidden={true}
      >
        <AcceptedFileIcon className="size-[1.25em]" />
      </div>
      <div className="min-w-0 grow">
        <p className="line-clamp-1 font-mono text-sm font-semibold text-ellipsis">
          {file.name}
        </p>
        <p className="text-xs text-fg-subtle">
          {formatBytes(file.size, locale, { maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="grid aspect-square place-content-center">
        <Button
          size="icon"
          onPress={() => removeFile()}
          aria-label="Remove file"
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
          "flex flex-col items-center gap-6 rounded border border-dashed p-6 text-fg-muted",
          {
            "border-destructive bg-destructive/10": fileRejections.length > 0,
            "border-accent bg-accent/10": isDragAccept,
          },
          rootProps?.className,
        ),
      })}
    >
      <div className="inline-flex grow flex-row items-center justify-normal gap-2 max-sm:text-sm">
        <FileUp aria-label="Upload file" />
        {isDragActive ? (
          "Drop a file here"
        ) : (
          <div>
            {"Drag a file here or "}
            <AriaButton
              type="button"
              className={(renderProps) =>
                linkVariants({
                  ...renderProps,
                  underline: "hover",
                  color: "link",
                  className: "cursor-pointer appearance-none select-text",
                })
              }
              onPress={open}
            >
              upload a file
            </AriaButton>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        {...getInputProps({
          ...inputProps,
          // react-dropzone@19.0.1 added fix for
          // react-dropzone/react-dropzone#1481 that no longer clips the input,
          // leading to the input taking up space in the div
          className: cn("sr-only", inputProps?.className),
        })}
      />
      {acceptedFiles.length > 0 && (
        <ol className="flex w-full flex-col gap-2">
          {acceptedFiles.map((file, index) => (
            <AcceptedFile
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
