import type { ComponentPropsWithRef } from "react";

import { useForm } from "@tanstack/react-form";
import {
  ExifFormat,
  getExifTagTable,
  type Format,
  type Ifd,
  type TagEntry,
} from "libexif-wasm";
import { IFD_NAMES } from "libexif-wasm/constants";

import { useExifEditorStoreContext } from "#hooks/useExifEditor";
import { Button } from "@exiftools/ui/components/Button";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopup,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxPortal,
  ComboboxList,
} from "@exiftools/ui/components/Combobox";
import { Input } from "@exiftools/ui/components/Input";
import { Label } from "@exiftools/ui/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exiftools/ui/components/Select";
import { Spinner } from "@exiftools/ui/components/Spinner";

type ExifEntryAddProps = ComponentPropsWithRef<"div">;

type FieldValues = {
  ifd: Ifd;
  tagEntry: TagEntry | null;
  format: Format;
  value: string;
};

const EXIF_TAG_TABLE = getExifTagTable();

const DEFAULT_FORM_VALUES: FieldValues = {
  ifd: "IFD_0",
  tagEntry: null,
  format: "UNDEFINED",
  value: "",
};

const ExifEntryAdd = (props: ExifEntryAddProps) => {
  const addExifEntry = useExifEditorStoreContext((state) => state.addExifEntry);
  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    onSubmit: ({ value }) => {
      if (value.tagEntry !== null) {
        const { value: entryValue, tagEntry, ...exifEntryObject } = value;

        addExifEntry({ tag: tagEntry.tag, ...exifEntryObject }, entryValue);
      }
    },
  });

  return (
    <div {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <form.Field
            name="tagEntry"
            validators={{
              onSubmit: ({ value }) =>
                value === null ? "Tag must be defined" : undefined,
            }}
            children={(field) => (
              <Combobox
                items={EXIF_TAG_TABLE}
                itemToStringLabel={(item) => {
                  return item.name;
                }}
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
              >
                <Label>Tag</Label>
                <ComboboxInput
                  inputProps={{
                    onBlur: field.handleBlur,
                    placeholder: "ImageDescription",
                  }}
                />
                <ComboboxPortal>
                  <ComboboxPopup>
                    <ComboboxEmpty />
                    <ComboboxList>
                      {(item: TagEntry) => (
                        <ComboboxItem key={item.tag} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxPopup>
                </ComboboxPortal>
              </Combobox>
            )}
          />
          <form.Field
            name="ifd"
            children={(field) => (
              <>
                <Label>Image File Domain</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value as FieldValues["ifd"]);
                  }}
                >
                  <SelectTrigger onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select an IFD" />
                  </SelectTrigger>
                  <SelectContent>
                    {IFD_NAMES.map((ifdName) => (
                      <SelectItem key={ifdName} value={ifdName}>
                        {ifdName}{" "}
                        <form.Subscribe
                          selector={(state) => state.values.tagEntry?.esl}
                        >
                          {(esl) => (esl === undefined ? null : esl[ifdName])}
                        </form.Subscribe>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          />
          <form.Field
            name="format"
            children={(field) => (
              <>
                <Label>Format</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value as FieldValues["format"]);
                  }}
                >
                  <SelectTrigger onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(ExifFormat).map(([format]) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          />
          <form.Field
            name="value"
            children={(field) => (
              <>
                <Label>Input</Label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" variant="surface" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="absolute" />}
                <span
                  className="data-[pending=true]:invisible"
                  data-pending={isSubmitting}
                >
                  Submit
                </span>
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
};

export { ExifEntryAdd };
