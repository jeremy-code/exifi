import * as z from "zod";

import type {
  ExifDataObject,
  ExifEntryObject,
} from "@exifi/core/exif/interfaces";

import {
  byteOrderSchema,
  dataTypeSchema,
  formatSchema,
  ifdSchema,
  rationalObjectSchema,
  tagSchema,
} from "./libexif";

const exifEntryObjectSchema = z.toZod<ExifEntryObject>()(
  z.intersection(
    z.object({
      ifd: ifdSchema,
      tag: tagSchema,
      components: z.number(),
      data: z.number().array(),
      size: z.number(),
      formattedValue: z.string().nullable(),
      byteOrder: byteOrderSchema,
    }),
    z.discriminatedUnion("format", [
      z.object({ format: z.literal("ASCII"), value: z.string() }),
      z.object({
        format: z.enum(["RATIONAL", "SRATIONAL"]),
        value: z.array(rationalObjectSchema),
      }),
      z.object({
        format: formatSchema.exclude(["ASCII", "RATIONAL", "SRATIONAL"]),
        value: z.array(z.number()),
      }),
    ]),
  ),
);

const exifDataObjectSchema = z.toZod<ExifDataObject>()(
  z.object({
    ifd: z.record(ifdSchema, z.array(exifEntryObjectSchema)),
    data: z.array(z.number()),
    dataType: dataTypeSchema.nullable(),
    byteOrder: byteOrderSchema.nullable(),
  }),
);

export { exifEntryObjectSchema, exifDataObjectSchema };
