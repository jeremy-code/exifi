import { formOptions } from "@tanstack/react-form";
import { exifTagTableCount } from "libexif-wasm";
import type { DistributedPick } from "type-fest";
import * as z from "zod";

import { exifEntryObjectSchema } from "@exifi/schemas/exif";
import { ifdSchema, tagEntrySchema } from "@exifi/schemas/libexif";

const addFormBaseSchema = z.object({
  ifd: ifdSchema,
  tagEntry: tagEntrySchema.extend({
    index: z
      .int()
      .min(0)
      .max(exifTagTableCount() - 2), // Excluding NULL terminator AND decrementing by 1 for indexing from 0
  }),
});

const addFormSchema = z.intersection(
  addFormBaseSchema,
  exifEntryObjectSchema.def.right,
);

type AddFieldValues = (
  | DistributedPick<z.infer<typeof addFormSchema>, "format" | "value">
  // If format is undefined, assume value is a string
  | { format: undefined; value: string }
) &
  Partial<Pick<z.infer<typeof addFormSchema>, "ifd" | "tagEntry">>;

const DEFAULT_FORM_VALUES: AddFieldValues = {
  ifd: undefined,
  tagEntry: undefined,
  format: undefined,
  value: "",
} as const;

const addEntryFormOptions = () =>
  formOptions({
    // oxlint-disable-next-line type`script/no-unnecessary-type-assertion -- Otherwise, TanStack form is unable to infer the correct type and chooses the more narrow type
    defaultValues: DEFAULT_FORM_VALUES as AddFieldValues,
    validators: { onSubmit: addFormSchema },
  });

export {
  addFormSchema,
  type AddFieldValues,
  DEFAULT_FORM_VALUES,
  addEntryFormOptions,
};
