import type { ComponentPropsWithRef, Dispatch, SetStateAction } from "react";

import { Minus, Plus } from "lucide-react";

import { NumberInput } from "#components/editor/NumberInput";
import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Button } from "@exifi/ui/components/Button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@exifi/ui/components/Collapsible";

type ExifEntryEditorProps = {
  exifEntryObject: ExifEntryObject;
  draft: number[];
  setDraft: Dispatch<SetStateAction<number[]>>;
} & ComponentPropsWithRef<typeof Collapsible>;

const ExifEntryByteEditor = ({
  exifEntryObject,
  draft,
  setDraft,
  ...props
}: ExifEntryEditorProps) => {
  const isRationalOrSRational =
    exifEntryObject.format === "SRATIONAL" ||
    exifEntryObject.format === "RATIONAL";

  return (
    (exifEntryObject.format === "ASCII" ||
      isRationalOrSRational ||
      exifEntryObject.tag === "USER_COMMENT") && (
      <Collapsible {...props}>
        <CollapsibleTrigger asChild>
          <Button className="group/collapsible-trigger" variant="outline">
            <span className="group-data-[state=closed]/collapsible-trigger:hidden">
              Close byte editor
            </span>
            <span className="group-data-[state=open]/collapsible-trigger:hidden">
              Open byte editor
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            {draft.map((value, index) => (
              <NumberInput
                key={index}
                value={value}
                onValueChange={(newValue) =>
                  setDraft((prevValue) => prevValue.with(index, newValue))
                }
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {exifEntryObject.components !== 1 &&
              exifEntryObject.format !== "ASCII" && (
                <Button
                  size="icon"
                  onClick={() =>
                    setDraft((prev) =>
                      prev.slice(0, isRationalOrSRational ? -2 : -1),
                    )
                  }
                >
                  <Minus size={16} />
                </Button>
              )}
            {exifEntryObject.components <
              (EXIF_TAG_MAP[exifEntryObject.tag]?.maxNumberOfComponents ??
                Infinity) &&
              exifEntryObject.format !== "ASCII" && (
                <Button
                  size="icon"
                  onClick={() => {
                    setDraft((prev) =>
                      prev.concat(isRationalOrSRational ? [0, 1] : [0]),
                    );
                  }}
                >
                  <Plus size={16} />
                </Button>
              )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  );
};

export { ExifEntryByteEditor };
