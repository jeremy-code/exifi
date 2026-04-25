import {
  type ComponentPropsWithRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import { cn } from "tailwind-variants";

import { type ExifEntryObject } from "#lib/exif/serializeExifData";

import { ExifEntryEditorFields } from "./ExifEntryEditorFields";

type ExifEntryEditorProps = {
  exifEntryObject: ExifEntryObject;
  draft: number[];
  setDraft: Dispatch<SetStateAction<number[]>>;
} & ComponentPropsWithRef<"div">;

const ExifEntryEditor = ({
  className,
  exifEntryObject,
  draft,
  setDraft,
  ...props
}: ExifEntryEditorProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4",
        className,
      )}
      {...props}
    >
      <ExifEntryEditorFields
        exifEntryObject={exifEntryObject}
        draft={draft}
        setDraft={setDraft}
      />
    </div>
  );
};

export { ExifEntryEditor, type ExifEntryEditorProps };
