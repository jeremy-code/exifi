import { useEffect, type ComponentPropsWithRef } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cn } from "tailwind-variants";

import { ExifEntryDraftContext } from "#features/exif-editor/contexts/ExifEntryDraftContext";
import { useExifEntryDraft } from "#features/exif-editor/hooks/useExifEntryDraft";
import { m } from "#paraglide/messages";
import { useDialogBlockerStore } from "#stores/dialogBlockerStore";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
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
          <ParaglideMessage
            message={m.editor_inspector_expected_change}
            inputs={{ value: m.editor_inspector_no_changes() }}
            markup={{
              changes: ({ children }) =>
                isChanged ? (
                  <ExifEntryValidity
                    exifEntryObject={
                      { ...exifEntryObject, value: draft } as ExifEntryObject
                    }
                  />
                ) : (
                  <span className="text-fg-muted italic">{children}</span>
                ),
            }}
          />
        </div>
        <ExifEntryByteEditor />
        <Button isDisabled={!isChanged} onPress={() => save()}>
          {isChanged
            ? m.editor_inspector_save_changes()
            : m.editor_inspector_saved()}
        </Button>
      </ExifEntryDraftContext>
    </div>
  );
};

export { ExifEntryInspector, type ExifEntryInspectorProps };
