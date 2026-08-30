import {
  mapRationalFromObject,
  mapRationalToObject,
  type RationalObject,
} from "libexif-wasm";
import { Minus, Plus } from "lucide-react";
import {
  Disclosure,
  type DisclosureProps,
  DisclosurePanel,
  Heading,
} from "react-aria-components/Disclosure";

import { useExifEntryDraftContext } from "#features/exif-editor/contexts/ExifEntryDraftContext";
import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
import { EXIF_TAG_MAP } from "@exifi/core/exif/exifTagMap";
import { XP_TAGS } from "@exifi/core/exif/xp/constants";
import { Button } from "@exifi/ui/components/Button";
import { NumberField } from "@exifi/ui/components/NumberField";

type ExifEntryEditorProps = DisclosureProps;

const ExifEntryByteEditor = (props: ExifEntryEditorProps) => {
  const { exifEntryObject, draft, setDraft } = useExifEntryDraftContext();

  const isRationalOrSRational =
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL";

  const isAscii = exifEntryObject.format === "ASCII";

  if (
    isRationalOrSRational ||
    isAscii ||
    (exifEntryObject.format === "BYTE" &&
      XP_TAGS.includes(exifEntryObject.tag)) ||
    exifEntryObject.tag === "USER_COMMENT"
  ) {
    const numberArray = isRationalOrSRational
      ? Array.from(
          mapRationalFromObject(
            draft as RationalObject[],
            exifEntryObject.format,
          ),
        )
      : isAscii
        ? Array.from(encodeStringToUtf8(draft as string))
        : (draft as number[]);

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
            {numberArray.map((value, index) => (
              <NumberField
                // eslint-disable-next-line @eslint-react/no-array-index-key -- Index is only reasonable key
                key={index}
                value={value}
                onChange={(newValue) => {
                  const newNumberArray = numberArray.with(index, newValue);
                  const newEntryValue = isAscii
                    ? decodeStringFromUtf8(new Uint8Array(newNumberArray))
                    : isRationalOrSRational
                      ? mapRationalToObject(
                          exifEntryObject.format === "SRATIONAL"
                            ? new Int32Array(newNumberArray)
                            : new Uint32Array(newNumberArray),
                        )
                      : newNumberArray;

                  setDraft(newEntryValue);
                }}
                aria-label={`${exifEntryObject.tag} component ${index + 1}`}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {exifEntryObject.components !== 1 &&
              exifEntryObject.format !== "ASCII" && (
                <Button
                  size="icon"
                  onPress={() => setDraft((prev) => prev.slice(0, -1))}
                  aria-label="Remove component"
                >
                  <Minus size={16} />
                </Button>
              )}
            {exifEntryObject.components <
              (EXIF_TAG_MAP[exifEntryObject.tag]?.maxNumberOfComponents ??
                Infinity) && (
              <Button
                size="icon"
                onPress={() => {
                  setDraft((prev) => {
                    if (isAscii) {
                      return (prev as string) + "\u0000";
                    } else if (isRationalOrSRational) {
                      return (prev as RationalObject[]).concat([
                        { numerator: 0, denominator: 1 },
                      ]);
                    }
                    return (prev as number[]).concat([0]);
                  });
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
