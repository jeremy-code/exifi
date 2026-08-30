import type { ComponentPropsWithRef } from "react";

import { useForm } from "@tanstack/react-form";
import {
  ExifFormat,
  exifIfdGetName,
  getExifTagTable,
  mapRationalFromObject,
  mapRationalToObject,
} from "libexif-wasm";
import { IFD_NAMES } from "libexif-wasm/constants";

import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
import {
  addEntryFormOptions,
  addFormSchema,
  type AddFieldValues,
} from "#features/exif-editor/forms/addEntryForm";
import { EXIF_TAG_MAP } from "#lib/exif/exifTagMap";
import { typedArrayInFormat } from "#lib/exif/utils/typedArrayInFormat";
import { FormatSchema } from "#schemas/exif";
import { useDialogBlockerStore } from "#stores/dialogBlockerStore";
import { decodeStringFromUtf8 } from "#utils/decodeStringFromUtf8";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
import {
  GEOLOCATION_TAGS,
  SUPPORT_LEVEL_MAP,
} from "@exifi/core/exif/constants";
import { Button } from "@exifi/ui/components/Button";
import { Callout, CalloutText } from "@exifi/ui/components/Callout";
import { ComboBox, ComboBoxItem } from "@exifi/ui/components/ComboBox";
import { Select, SelectItem } from "@exifi/ui/components/Select";
import { Spinner } from "@exifi/ui/components/Spinner";

import { ExifEntryAddEditor } from "./ExifEntryAddEditor";

const EXIF_TAG_TABLE = getExifTagTable();

type ExifEntryAddFormProps = ComponentPropsWithRef<"form">;

const ExifEntryAddForm = (props: ExifEntryAddFormProps) => {
  const setIsDialogBlocked = useDialogBlockerStore(
    (state) => state.setIsDialogBlocked,
  );
  const addExifEntry = useExifEditor((state) => state.addExifEntry);
  const addForm = useForm({
    ...addEntryFormOptions(),
    onSubmit: ({ value }) => {
      const {
        value: entryValue,
        tagEntry,
        ...exifEntryObject
      } = addFormSchema.parse(value);

      addExifEntry({ tag: tagEntry.tag, ...exifEntryObject }, entryValue);
      addForm.reset({ format: undefined, value: "" });
      setIsDialogBlocked(false);
    },
    listeners: {
      onChange: (props) => {
        setIsDialogBlocked(!props.formApi.state.isDefaultValue);
      },
    },
  });

  return (
    <>
      <addForm.Subscribe selector={(state) => state.values.tagEntry?.tag}>
        {(tag) => {
          if (tag !== undefined && GEOLOCATION_TAGS.includes(tag)) {
            return (
              <Callout variant="warning" className="mb-4">
                <CalloutText>
                  {`Are you trying to edit a geolocation field? Consider using the "Edit GPS" button instead in the toolbar to the right of the Add Exif Entry button.`}
                </CalloutText>
              </Callout>
            );
          }
          return null;
        }}
      </addForm.Subscribe>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void addForm.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <addForm.Field name="tagEntry">
            {(field) => (
              <ComboBox
                items={EXIF_TAG_TABLE.map((item, index) => ({
                  id: index,
                  ...item,
                }))}
                value={field.state.value?.index}
                onChange={(value) => {
                  if (typeof value !== "number") {
                    return;
                  }

                  const tagEntry = EXIF_TAG_TABLE.at(value);
                  if (tagEntry !== undefined) {
                    field.handleChange({ ...tagEntry, index: value });
                  }
                }}
                onBlur={field.handleBlur}
                label="Tag"
                placeholder="ImageDescription"
                // Not using isInvalid/errorMessage because the default error messages
                // are more informative compared to Zod's
                isRequired
              >
                {(item) => (
                  <ComboBoxItem id={item.id} value={item}>
                    {item.name}
                  </ComboBoxItem>
                )}
              </ComboBox>
            )}
          </addForm.Field>
          <addForm.Field name="ifd">
            {(field) => (
              <Select
                label="Image File Domain"
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value as AddFieldValues["ifd"]);
                }}
                placeholder="Select an IFD"
                onBlur={field.handleBlur}
                isRequired
              >
                {IFD_NAMES.map((ifdName) => (
                  <addForm.Subscribe
                    key={ifdName}
                    selector={(state) => state.values.tagEntry?.esl}
                  >
                    {(esl) => (
                      <SelectItem
                        id={ifdName}
                        isDisabled={
                          esl !== undefined &&
                          ["UNKNOWN", "NOT_RECORDED"].includes(esl[ifdName])
                        }
                      >
                        {`${exifIfdGetName(ifdName)}${
                          esl === undefined
                            ? ""
                            : ` (${SUPPORT_LEVEL_MAP[esl[ifdName]]})`
                        }`}
                      </SelectItem>
                    )}
                  </addForm.Subscribe>
                ))}
              </Select>
            )}
          </addForm.Field>
          <addForm.Field name="format">
            {(field) => (
              <Select
                label="Format"
                value={field.state.value}
                placeholder="Select a format"
                onChange={(value) => {
                  const currFormValues = addForm.state.values;

                  if (value === currFormValues.format) {
                    return field.handleChange(value);
                  }

                  const result = FormatSchema.safeParse(value);
                  if (!result.success) {
                    return field.handleChange("UNDEFINED");
                  }

                  const typedArray =
                    currFormValues.format === "ASCII" ||
                    currFormValues.format === undefined
                      ? encodeStringToUtf8(currFormValues.value)
                      : currFormValues.format === "RATIONAL" ||
                          currFormValues.format === "SRATIONAL"
                        ? mapRationalFromObject(
                            currFormValues.value,
                            currFormValues.format,
                          )
                        : typedArrayInFormat(
                            currFormValues.value as number[],
                            currFormValues.format,
                          );

                  try {
                    if (value === "ASCII") {
                      addForm.setFieldValue(
                        "value",
                        decodeStringFromUtf8(typedArray),
                      );
                    } else if (value === "RATIONAL" || value === "SRATIONAL") {
                      addForm.setFieldValue(
                        "value",
                        mapRationalToObject(typedArray),
                      );
                    } else {
                      addForm.setFieldValue(
                        "value",
                        Array.from(typedArrayInFormat(typedArray, result.data)),
                      );
                    }
                  } catch (e) {
                    console.error(e);
                    addForm.setFieldValue("value", value === "ASCII" ? "" : []);
                  }

                  field.handleChange(result.data);
                }}
                onBlur={field.handleBlur}
                isRequired
              >
                {Array.from(ExifFormat).map(([format]) => (
                  <addForm.Subscribe
                    key={format}
                    selector={(state) => state.values.tagEntry?.tag}
                  >
                    {(tag) => (
                      <SelectItem
                        id={format}
                        isDisabled={
                          tag !== undefined &&
                          tag in EXIF_TAG_MAP &&
                          !EXIF_TAG_MAP[tag]?.format.includes(format)
                        }
                      >
                        {format}
                      </SelectItem>
                    )}
                  </addForm.Subscribe>
                ))}
              </Select>
            )}
          </addForm.Field>
          <addForm.Subscribe selector={(state) => state.values}>
            {(value) => (
              <addForm.Field
                key={`${value.tagEntry?.tag}-${value.format}-${value.ifd}`}
                name="value"
              >
                {(field) => (
                  <ExifEntryAddEditor
                    exifEntryObject={{ ...value, tag: value.tagEntry?.tag }}
                    onValueChange={field.handleChange}
                  />
                )}
              </addForm.Field>
            )}
          </addForm.Subscribe>
          <addForm.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                className="mt-4 self-end px-8"
                type="submit"
                variant="surface"
                isDisabled={isSubmitting}
              >
                {isSubmitting && <Spinner className="absolute" />}
                <span
                  className="data-[pending=true]:invisible"
                  data-pending={isSubmitting}
                >
                  Submit
                </span>
              </Button>
            )}
          </addForm.Subscribe>
        </div>
      </form>
    </>
  );
};

export { ExifEntryAddForm, type ExifEntryAddFormProps };
