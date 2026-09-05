import { formOptions } from "@tanstack/react-form";
import { exifTagTableCount } from "libexif-wasm";
import { z } from "zod";

import { FormatSchema, IfdSchema, TagEntrySchema } from "#schemas/exif";

import {
  MAX_INT32_VALUE,
  MAX_UINT32_VALUE,
} from "../../../../../../packages/core/src/exif/constants";

const addFormSchema = z.strictObject({
  ifd: IfdSchema,
  tagEntry: TagEntrySchema.extend({
    index: z
      .int()
      .min(0)
      .max(exifTagTableCount() - 2), // Excluding NULL terminator AND decrementing by 1 for indexing from 0
  }),
  format: FormatSchema,
  value: z.array(
    z
      .int()
      .min(-1 * (MAX_INT32_VALUE + 1))
      .max(MAX_UINT32_VALUE),
  ),
});

type AddFieldValues = Partial<z.infer<typeof addFormSchema>> &
  Pick<z.infer<typeof addFormSchema>, "value">;

const DEFAULT_FORM_VALUES: AddFieldValues = {
  ifd: undefined,
  tagEntry: undefined,
  format: undefined,
  value: [],
};

const addEntryFormOptions = () =>
  formOptions({
    defaultValues: DEFAULT_FORM_VALUES,
    validators: {
      onSubmit: addFormSchema,
    },
  });

export {
  addFormSchema,
  type AddFieldValues,
  DEFAULT_FORM_VALUES,
  addEntryFormOptions,
};
