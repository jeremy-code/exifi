import { Minus, Plus } from "lucide-react";
import {
  Disclosure,
  type DisclosureProps,
  DisclosurePanel,
  Heading,
} from "react-aria-components/Disclosure";

import { useExifEntryDraftContext } from "#features/exif-editor/contexts/ExifEntryDraftContext";
import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import { XP_TAGS } from "#lib/exif/xp/constants";
import { Button } from "@exifi/ui/components/Button";
import { NumberField } from "@exifi/ui/components/NumberField";

type ExifEntryEditorProps = DisclosureProps;

const ExifEntryByteEditor = (props: ExifEntryEditorProps) => {
  const { exifEntryObject, draft, setDraft } = useExifEntryDraftContext();

  const isRationalOrSRational =
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL";

  if (
    isRationalOrSRational ||
    exifEntryObject.format === "ASCII" ||
    (exifEntryObject.format === "BYTE" &&
      XP_TAGS.includes(exifEntryObject.tag)) ||
    exifEntryObject.tag === "USER_COMMENT"
  ) {
    return (
      <Disclosure {...props}>
        <Heading>
          <Button
            slot="trigger"
            className="group/collapsible-trigger"
            variant="outline"
          >
            <span className="group-aria-[expanded=false]/collapsible-trigger:hidden">
              Close byte editor
            </span>
            <span className="group-aria-expanded/collapsible-trigger:hidden">
              Open byte editor
            </span>
          </Button>
        </Heading>
        <DisclosurePanel className="mt-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(--spacing(20),1fr))] gap-2">
            {draft.map((value, index) => (
              <NumberField
                key={index}
                value={value}
                onChange={(newValue) =>
                  setDraft((prevValue) => prevValue.with(index, newValue))
                }
                aria-label={`${exifEntryObject.tag} component ${index + 1}`}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {exifEntryObject.components !== 1 &&
              exifEntryObject.format !== "ASCII" && (
                <Button
                  size="icon"
                  onPress={() =>
                    setDraft((prev) =>
                      prev.slice(0, isRationalOrSRational ? -2 : -1),
                    )
                  }
                  aria-label="Remove component"
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
                  onPress={() => {
                    setDraft((prev) =>
                      prev.concat(isRationalOrSRational ? [0, 1] : [0]),
                    );
                  }}
                  aria-label="Add component"
                >
                  <Plus size={16} />
                </Button>
              )}
          </div>
        </DisclosurePanel>
      </Disclosure>
    );
  }

  return null;
};

export { ExifEntryByteEditor };
