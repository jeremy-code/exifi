import { formOptions } from "@tanstack/react-form";
import { exifTagTableCount } from "libexif-wasm";
import type { DistributedPick } from "type-fest";
import { z } from "zod";

import { IfdSchema, TagEntrySchema } from "#schemas/exif";
import { MAX_INT32_VALUE, MAX_UINT32_VALUE } from "@exifi/core/exif/constants";

const addFormBaseSchema = z.object({
  ifd: IfdSchema,
  tagEntry: TagEntrySchema.extend({
    index: z
      .int()
      .min(0)
      .max(exifTagTableCount() - 2), // Excluding NULL terminator AND decrementing by 1 for indexing from 0
  }),
});

const addFormSchema = z.discriminatedUnion("format", [
  addFormBaseSchema.extend({ format: z.literal("ASCII"), value: z.string() }),
  addFormBaseSchema.extend({
    format: z.enum(["RATIONAL", "SRATIONAL"]),
    value: z.array(
      z.strictObject({
        numerator: z
          .number()
          .min(-1 * (MAX_INT32_VALUE + 1))
          .max(MAX_UINT32_VALUE),
        denominator: z
          .number()
          .min(-1 * (MAX_INT32_VALUE + 1))
          .max(MAX_UINT32_VALUE),
      }),
    ),
  }),
  addFormBaseSchema.extend({
    format: z.enum([
      "BYTE",
      "SHORT",
      "LONG",
      "SBYTE",
      "UNDEFINED",
      "SSHORT",
      "SLONG",
      "FLOAT",
      "DOUBLE",
    ] as const),
    value: z.array(
      z
        .int()
        .min(-1 * (MAX_INT32_VALUE + 1))
        .max(MAX_UINT32_VALUE),
    ),
  }),
]);

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
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- Otherwise, TanStack form is unable to infer the correct type and chooses the more narrow type
    defaultValues: DEFAULT_FORM_VALUES as AddFieldValues,
    validators: { onSubmit: addFormSchema },
  });

export {
  addFormSchema,
  type AddFieldValues,
  DEFAULT_FORM_VALUES,
  addEntryFormOptions,
};
