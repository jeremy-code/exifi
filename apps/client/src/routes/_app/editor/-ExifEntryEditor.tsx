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
  type ValidTypedArray,
} from "libexif-wasm";
import { ChevronDown } from "lucide-react";
import { cn } from "tailwind-variants";

import { RationalInput } from "#components/editor/RationalInput";
import { useExifEditorStoreContext } from "#hooks/useExifEditor";
import { getValueFromExifEntryObject } from "#lib/exif/getValueFromExifEntryObject";
import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";
import { type ExifEntryObject } from "#lib/exif/serializeExifData";
import { arrayEquals } from "#utils/arrayEquals";
import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
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
import { Input, type InputProps } from "@exiftools/ui/components/Input";
import {
  Textarea,
  type TextareaProps,
} from "@exiftools/ui/components/Textarea";

type ExifEntryEditorProps = {
  exifEntryObject: ExifEntryObject;
};

const ValidityCheck = ({
  className,
  exifEntryObject,
  newValue,
  ...props
}: {
  exifEntryObject: ExifEntryObject;
  newValue: ValidTypedArray;
} & ComponentPropsWithRef<"span">) => {
  const expectedValue = getValueFromExifEntryObject({
    ...exifEntryObject,
    value: Array.from(newValue),
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

const ExifEntryValueEditor = ({
  value,
  setValue,
  ...props
}: {
  value: number;
  setValue: (value: number) => void;
} & Omit<InputProps, "value">) => {
  return (
    <Input
      {...props}
      type="number"
      value={value}
      onChange={(e) => {
        if (!Number.isNaN(e.target.valueAsNumber)) {
          setValue(e.target.valueAsNumber);
        } else if (e.target.value === "") {
          setValue(0);
        }
      }}
    />
  );
};

const ExifEntryAsciiValueEditor = ({
  value,
  setValue,
  ...props
}: {
  value: ValidTypedArray;
  setValue: (value: ValidTypedArray) => void;
} & Omit<TextareaProps, "value">) => {
  const asciiValue = useMemo(
    () => decodeStringFromUtf8(Uint8Array.from(value)),
    [value],
  );

  return (
    <Textarea
      {...props}
      value={asciiValue}
      onChange={(e) => {
        setValue(encodeStringToUtf8(e.target.value));
      }}
    />
  );
};

const supportLevelMap = {
  MANDATORY: "Mandatory",
  UNKNOWN: "Unknown",
  NOT_RECORDED: "Not recorded",
  OPTIONAL: "Optional",
};

const ExifEntryEditor = ({ exifEntryObject }: ExifEntryEditorProps) => {
  const [newValue, setNewValue] = useState(() =>
    newTypedArrayInFormat(exifEntryObject.value, exifEntryObject.format),
  );
  const updateExifEntry = useExifEditorStoreContext(
    (state) => state.updateExifEntry,
  );

  const setNewValueAtIndex = useCallback((index: number) => {
    return (value: number) => {
      setNewValue((prevNewValue) => {
        return prevNewValue.with(index, value);
      });
    };
  }, []);

  const setRationalAtIndex = useCallback(
    (index: number) => {
      return (value: RationalObject | undefined) => {
        setNewValueAtIndex(index * 2)(value?.numerator ?? 0);
        setNewValueAtIndex(index * 2 + 1)(value?.denominator ?? 0);
      };
    },
    [setNewValueAtIndex],
  );

  const isChanged = useMemo(
    () => !arrayEquals(exifEntryObject.value, Array.from(newValue)),
    [newValue, exifEntryObject.value],
  );
  const [isByteEditorOpen, setIsByteEditorOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <Collapsible
        open={isInfoOpen}
        onOpenChange={(open) => setIsInfoOpen(open)}
      >
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
                  {exifFormatGetName(exifEntryObject.format)} (
                  {formatPlural(exifFormatGetSize(exifEntryObject.format), {
                    one: " byte",
                    other: " bytes",
                  })}
                  )
                </DataListItemValue>
              </DataListItem>
              <DataListItem>
                <DataListItemLabel className="min-w-50">
                  Components
                </DataListItemLabel>
                <DataListItemValue>
                  {formatPlural(exifEntryObject.components, {
                    one: " component",
                    other: " components",
                  })}
                  {" ("}
                  {formatPlural(exifEntryObject.size, {
                    one: " byte",
                    other: " bytes",
                  })}
                  {" in total)"}
                </DataListItemValue>
              </DataListItem>
            </DataList>
          </CollapsibleContent>
        </DataList>
        <CollapsibleTrigger asChild>
          <Button className="mt-4" variant="muted">
            <ChevronDown
              className="transition-transform data-[open=true]:rotate-180"
              data-open={isInfoOpen}
            />
            {isInfoOpen ? "See less" : "See more"}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(--spacing(50),1fr))]">
        {(
          exifEntryObject.format === "RATIONAL" ||
          exifEntryObject.format === "SRATIONAL"
        ) ?
          mapRationalToObject(
            newTypedArrayInFormat(newValue, exifEntryObject.format),
          ).map((rationalObject, index) => (
            <RationalInput
              key={`${rationalObject.numerator}/${rationalObject.denominator}`}
              initialRational={rationalObject}
              setRational={setRationalAtIndex(index)}
            />
          ))
        : exifEntryObject.format === "ASCII" ?
          <ExifEntryAsciiValueEditor value={newValue} setValue={setNewValue} />
        : Array.from(newValue).map((value, index) => (
            <ExifEntryValueEditor
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
      {(exifEntryObject.format === "ASCII" ||
        exifEntryObject.format === "RATIONAL" ||
        exifEntryObject.format === "SRATIONAL") && (
        <Collapsible
          open={isByteEditorOpen}
          onOpenChange={(open) => setIsByteEditorOpen(open)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              {isByteEditorOpen ? "Close byte editor" : "Open byte editor"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(--spacing(30),1fr))]">
            {Array.from(newValue).map((value, index) => (
              <ExifEntryValueEditor
                key={index}
                value={value}
                setValue={setNewValueAtIndex(index)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Button
        disabled={!isChanged}
        onClick={() => {
          updateExifEntry(exifEntryObject, newValue);
        }}
      >
        {isChanged ? "Save changes" : "Saved"}
      </Button>
    </div>
  );
};

export { ExifEntryEditor, type ExifEntryEditorProps };
