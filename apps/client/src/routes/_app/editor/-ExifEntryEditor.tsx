import {
  useCallback,
  useMemo,
  useState,
  type ComponentPropsWithRef,
} from "react";

import {
  exifFormatGetName,
  exifFormatGetSize,
  exifIfdGetName,
  mapRationalToObject,
  ExifTagInfo,
  type RationalObject,
} from "libexif-wasm";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "tailwind-variants";

import { AsciiTextarea } from "#components/editor/AsciiTextarea";
import { NumberInput } from "#components/editor/NumberInput";
import { RationalInput } from "#components/editor/RationalInput";
import { useExifEditorStoreContext } from "#hooks/useExifEditor";
import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import { getValueFromExifEntryObject } from "#lib/exif/getValueFromExifEntryObject";
import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";
import { type ExifEntryObject } from "#lib/exif/serializeExifData";
import { arrayLikeEquals } from "#utils/arrayLikeEquals";
import { formatPlural } from "#utils/formatPlural";
import { Button } from "@exiftools/ui/components/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exiftools/ui/components/Collapsible";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exiftools/ui/components/DataList";

const ValidityCheck = ({
  className,
  exifEntryObject,
  newValue,
  ...props
}: {
  exifEntryObject: ExifEntryObject;
  newValue: number[];
} & ComponentPropsWithRef<"span">) => {
  const expectedValue = getValueFromExifEntryObject({
    ...exifEntryObject,
    value: newValue,
  });
  const isEmptyString = expectedValue === "";

  return (
    <span
      className={cn(
        { "text-muted-foreground italic": isEmptyString },
        className,
      )}
      {...props}
    >
      {!isEmptyString ? expectedValue : "(empty)"}
    </span>
  );
};

const supportLevelMap = {
  MANDATORY: "Mandatory",
  UNKNOWN: "Unknown",
  NOT_RECORDED: "Not recorded",
  OPTIONAL: "Optional",
};

type ExifEntryEditorProps = {
  exifEntryObject: ExifEntryObject;
};

const ExifEntryEditor = ({ exifEntryObject }: ExifEntryEditorProps) => {
  const [newValue, setNewValue] = useState(exifEntryObject.value);
  const updateExifEntry = useExifEditorStoreContext((s) => s.updateExifEntry);
  const setNewValueAtIndex = useCallback(
    (index: number) => (value: number) =>
      setNewValue((prevNewValue) => prevNewValue.with(index, value)),
    [],
  );
  const setRationalAtIndex = useCallback(
    (index: number) => (value: RationalObject) =>
      setNewValue((prevNewValue) =>
        prevNewValue.toSpliced(
          index * 2,
          2,
          value.numerator,
          value.denominator,
        ),
      ),
    [],
  );
  const isChanged = useMemo(
    () => !arrayLikeEquals(exifEntryObject.value, newValue),
    [newValue, exifEntryObject.value],
  );
  const isRationalOrSRational =
    exifEntryObject.format === "RATIONAL" ||
    exifEntryObject.format === "SRATIONAL";

  return (
    <div className="flex flex-col gap-8">
      <Collapsible>
        <DataList orientation="horizontal" variant="bold">
          <DataListItem>
            <DataListItemLabel className="min-w-50">Tag</DataListItemLabel>
            <DataListItemValue>
              {ExifTagInfo.getTitleInIfd(
                exifEntryObject.tag,
                exifEntryObject.ifd,
              )}
            </DataListItemValue>
          </DataListItem>
          <DataListItem>
            <DataListItemLabel className="min-w-50">Value</DataListItemLabel>
            <DataListItemValue>
              {exifEntryObject.formattedValue}
            </DataListItemValue>
          </DataListItem>
          <CollapsibleContent>
            <DataList>
              <DataListItem>
                <DataListItemLabel className="min-w-50">
                  Tag description
                </DataListItemLabel>
                <DataListItemValue>
                  {ExifTagInfo.getDescriptionInIfd(
                    exifEntryObject.tag,
                    exifEntryObject.ifd,
                  )}
                </DataListItemValue>
              </DataListItem>
              <DataListItem>
                <DataListItemLabel className="min-w-50">
                  Image File Directory
                </DataListItemLabel>
                <DataListItemValue>
                  {exifIfdGetName(exifEntryObject.ifd)}
                </DataListItemValue>
              </DataListItem>
              <DataListItem>
                <DataListItemLabel className="min-w-50">
                  Support level
                </DataListItemLabel>
                <DataListItemValue>
                  {
                    supportLevelMap[
                      ExifTagInfo.getSupportLevelInIfd(
                        exifEntryObject.tag,
                        exifEntryObject.ifd,
                      )
                    ]
                  }
                </DataListItemValue>
              </DataListItem>
              <DataListItem>
                <DataListItemLabel className="min-w-50">
                  Format
                </DataListItemLabel>
                <DataListItemValue>
                  {`${exifFormatGetName(exifEntryObject.format)} (${formatPlural(
                    exifFormatGetSize(exifEntryObject.format),
                    { one: " byte", other: " bytes" },
                  )})`}
                </DataListItemValue>
              </DataListItem>
              <DataListItem>
                <DataListItemLabel className="min-w-50">
                  Components
                </DataListItemLabel>
                <DataListItemValue>
                  {`${formatPlural(exifEntryObject.components, {
                    one: " component",
                    other: " components",
                  })} (${formatPlural(exifEntryObject.size, {
                    one: " byte",
                    other: " bytes",
                  })} in total)`}
                </DataListItemValue>
              </DataListItem>
            </DataList>
          </CollapsibleContent>
        </DataList>
        <CollapsibleTrigger asChild>
          <Button className="group/collapsible-trigger mt-4" variant="muted">
            <ChevronDown
              size={16}
              className="transition-transform data-[open=true]:rotate-180"
            />
            <span className="group-data-[state=closed]/collapsible-trigger:hidden">
              See less
            </span>
            <span className="group-data-[state=open]/collapsible-trigger:hidden">
              See more
            </span>
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {isRationalOrSRational ?
          mapRationalToObject(
            newTypedArrayInFormat(newValue, exifEntryObject.format),
          ).map((rationalObject, index) => (
            <RationalInput
              key={index}
              initialRational={rationalObject}
              setRational={setRationalAtIndex(index)}
            />
          ))
        : exifEntryObject.format === "ASCII" ?
          <AsciiTextarea value={newValue} setValue={setNewValue} />
        : newValue.map((value, index) => (
            <NumberInput
              key={index}
              value={value}
              setValue={setNewValueAtIndex(index)}
            />
          ))
        }
      </div>
      <div>
        {"Expected change: "}
        {isChanged ?
          <ValidityCheck
            exifEntryObject={exifEntryObject}
            newValue={newValue}
          />
        : <span className="text-muted-foreground italic">no changes</span>}
      </div>
      {(exifEntryObject.format === "ASCII" || isRationalOrSRational) && (
        <Collapsible>
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
              {newValue.map((value, index) => (
                <NumberInput
                  key={index}
                  value={value}
                  setValue={setNewValueAtIndex(index)}
                />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              {exifEntryObject.components !== 1 &&
                exifEntryObject.format !== "ASCII" && (
                  <Button
                    size="icon"
                    onClick={() =>
                      setNewValue((prev) =>
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
                      setNewValue((prev) =>
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
      )}
      <Button
        disabled={!isChanged}
        onClick={() =>
          updateExifEntry(
            exifEntryObject,
            newTypedArrayInFormat(newValue, exifEntryObject.format),
          )
        }
      >
        {isChanged ? "Save changes" : "Saved"}
      </Button>
    </div>
  );
};

export { ExifEntryEditor, type ExifEntryEditorProps };
