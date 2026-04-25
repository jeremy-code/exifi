import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { useExifEntryDraft } from "#features/exif-editor/hooks/useExifEntryDraft";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Button } from "@exifi/ui/components/Button";

import { ExifEntryEditor } from "./ExifEntryEditor";
import { ExifEntryMetadata } from "./ExifEntryMetadata";
import { ExifEntryValidity } from "./ExifEntryValidity";

type ExifEntryInspectorProps = {
  exifEntryObject: ExifEntryObject;
} & ComponentPropsWithRef<"div">;

const ExifEntryInspector = ({
  className,
  exifEntryObject,
  ...props
}: ExifEntryInspectorProps) => {
  const { draft, setDraft, isChanged, save } =
    useExifEntryDraft(exifEntryObject);

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <ExifEntryMetadata exifEntryObject={exifEntryObject} />
      <ExifEntryEditor
        exifEntryObject={exifEntryObject}
        draft={draft}
        setDraft={setDraft}
      />
      <div>
        {"Expected change: "}
        {isChanged ?
          <ExifEntryValidity exifEntryObject={exifEntryObject} draft={draft} />
        : <span className="text-muted-foreground italic">no changes</span>}
      </div>
      <Button disabled={!isChanged} onClick={() => save()}>
        {isChanged ? "Save changes" : "Saved"}
      </Button>
    </div>
  );
};

export { ExifEntryInspector, type ExifEntryInspectorProps };
