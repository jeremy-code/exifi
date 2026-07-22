import { useEffect, type ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { ExifEntryDraftContext } from "#features/exif-editor/contexts/ExifEntryDraftContext";
import { useExifEntryDraft } from "#features/exif-editor/hooks/useExifEntryDraft";
import type { ExifEntryObject } from "#lib/exif/interfaces";
import { useDialogBlockerStore } from "#stores/dialogBlockerStore";
import { Button } from "@exifi/ui/components/Button";

import { ExifEntryByteEditor } from "./ExifEntryByteEditor";
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

  useEffect(() => {
    useDialogBlockerStore.getState().setIsDialogBlocked(isChanged);
  }, [isChanged]);

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <ExifEntryDraftContext value={{ exifEntryObject, draft, setDraft }}>
        <ExifEntryMetadata exifEntryObject={exifEntryObject} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(--spacing(18.75),1fr))] gap-4">
          <ExifEntryEditor />
        </div>
        <div>
          {"Expected change: "}
          {isChanged ? (
            <ExifEntryValidity
              exifEntryObject={{ ...exifEntryObject, value: draft }}
            />
          ) : (
            <span className="text-fg-muted italic">no changes</span>
          )}
        </div>
        <ExifEntryByteEditor />
        <Button isDisabled={!isChanged} onPress={() => save()}>
          {isChanged ? "Save changes" : "Saved"}
        </Button>
      </ExifEntryDraftContext>
    </div>
  );
};

export { ExifEntryInspector, type ExifEntryInspectorProps };
