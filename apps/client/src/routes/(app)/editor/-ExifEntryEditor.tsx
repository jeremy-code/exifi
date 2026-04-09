import { useCallback, useState } from "react";

import {
  ExifData,
  ExifEntry,
  ExifIfd,
  mapRationalToObject,
  type RationalObject,
} from "libexif-wasm";

import { RationalInput } from "#components/editor/RationalInput";
import { useExifEditorStoreContext } from "#hooks/useExifEditor";
import { newTypedArrayInFormat } from "#lib/exif/newTypedArrayInFormat";
import { type ExifEntryObject } from "#lib/exif/serializeExifData";
import { arrayEquals } from "#utils/arrayEquals";
import { Button } from "@exiftools/ui/components/Button";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exiftools/ui/components/DataList";
import { Input } from "@exiftools/ui/components/Input";

type ExifEntryEditorProps = {
  exifEntryObject: ExifEntryObject;
};

const getEntryValue = (
  exifEntryObject: Partial<ExifEntryObject> &
    Pick<ExifEntryObject, "format" | "byteOrder" | "value" | "ifd" | "tag">,
) => {
  const exifData = ExifData.new();
  exifData.byteOrder = exifEntryObject.byteOrder;
  const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
  const exifEntry = ExifEntry.new();
  exifEntry.tag = exifEntryObject.tag;
  exifEntry.format = exifEntryObject.format;
  exifContent.addEntry(exifEntry);

  exifEntry.fromTypedArray(
    newTypedArrayInFormat(exifEntryObject.value, exifEntryObject.format),
  );
  const formattedValue = exifEntry.toString();

  exifData.free();
  return formattedValue;
};

const ValidityCheck = ({
  exifEntryObject,
  newValue,
}: {
  exifEntryObject: ExifEntryObject;
  newValue: number[];
}) => {
  const value = getEntryValue({
    ...exifEntryObject,
    value: newValue,
  });

  return <span>{value !== "" ? value : "(empty)"}</span>;
};

const ExifEntryValueEditor = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) => {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => {
        if (!Number.isNaN(e.target.valueAsNumber)) {
          setValue(e.target.valueAsNumber);
        }
      }}
    />
  );
};

const ExifEntryEditor = ({ exifEntryObject }: ExifEntryEditorProps) => {
  const [newValue, setNewValue] = useState(exifEntryObject.value);
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

  const isChanged = arrayEquals(exifEntryObject.value, newValue);

  console.log("exifEntryObject", exifEntryObject);

  return (
    <div className="flex flex-col gap-8">
      <DataList orientation="vertical" variant="bold">
        <DataListItem>
          <DataListItemLabel>Tag</DataListItemLabel>
          <DataListItemValue>{exifEntryObject.tag}</DataListItemValue>
          <DataListItemLabel>Size</DataListItemLabel>
          <DataListItemValue>{exifEntryObject.size}</DataListItemValue>
          <DataListItemLabel>IFD</DataListItemLabel>
          <DataListItemValue>{exifEntryObject.ifd}</DataListItemValue>
          <DataListItemLabel>Value</DataListItemLabel>
          <DataListItemValue>
            {exifEntryObject.formattedValue}
          </DataListItemValue>
        </DataListItem>
      </DataList>
      <div>
        <p>Edit</p>
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
          : newValue.map((value, index) => (
              <ExifEntryValueEditor
                key={index}
                value={value}
                setValue={setNewValueAtIndex(index)}
              />
            ))
          }
        </div>
      </div>
      <div>
        Expected change:{" "}
        <ValidityCheck exifEntryObject={exifEntryObject} newValue={newValue} />
      </div>
      <Button
        disabled={isChanged}
        onClick={() => {
          updateExifEntry(
            exifEntryObject,
            newTypedArrayInFormat(newValue, exifEntryObject.format),
          );
        }}
      >
        {isChanged ? "Saved" : "Save changes"}
      </Button>
    </div>
  );
};

export { ExifEntryEditor, type ExifEntryEditorProps };
