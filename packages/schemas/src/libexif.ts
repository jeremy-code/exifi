import {
  ExifDataType,
  ExifFormat,
  ExifIfd,
  ExifSupportLevel,
  ExifTagUnified,
  type ByteOrder,
  type Format,
  type Ifd,
  type RationalObject,
  type SupportLevel,
  type Tag,
  type TagEntry,
  type DataType,
  type ExifMnoteData,
} from "libexif-wasm";
import * as z from "zod";

const tagSchema = z.toZod<Tag>()(
  z.enum(Array.from(ExifTagUnified, ([key]) => key)),
);

const supportLevelSchema = z.toZod<SupportLevel>()(
  z.enum(Array.from(ExifSupportLevel, ([key]) => key)),
);

const ifdSchema = z.toZod<Ifd>()(
  z.enum(Array.from(ExifIfd, ([key]) => key)).exclude(["COUNT"]),
);

const byteOrderSchema = z.toZod<ByteOrder>()(z.enum(["MOTOROLA", "INTEL"]));

const formatSchema = z.toZod<Format>()(
  z.enum(Array.from(ExifFormat, ([key]) => key)),
);

const dataTypeSchema = z.toZod<DataType>()(
  z.enum(Array.from(ExifDataType, ([key]) => key)).exclude(["COUNT"]),
);

const tagEntrySchema = z.toZod<TagEntry>()(
  z.strictObject({
    tagVal: z.int().min(0).max(0xffff /* 16-bit integer tag */),
    tag: tagSchema,
    name: z.string().min(1),
    title: z.string(),
    description: z.string(),
    esl: z.record(ifdSchema, supportLevelSchema),
  }),
);

const rationalObjectSchema = z.toZod<RationalObject>()(
  z.strictObject({
    numerator: z.number(),
    denominator: z.number(),
  }),
);

const mnoteDataEntrySchema = z.toZod<ExifMnoteData["data"][number]>()(
  z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    value: z.string().nullable(),
  }),
);

export {
  tagSchema,
  supportLevelSchema,
  ifdSchema,
  byteOrderSchema,
  formatSchema,
  dataTypeSchema,
  tagEntrySchema,
  rationalObjectSchema,
  mnoteDataEntrySchema,
};
