import type {
  ByteOrder,
  Format,
  Ifd,
  RationalObject,
  SupportLevel,
  Tag,
  TagEntry,
  DataType,
  ExifMnoteData,
} from "libexif-wasm";
import {
  ExifTagUnifiedBiMap,
  ExifSupportLevelBiMap,
  ExifIfdBiMap,
  ExifFormatBiMap,
  ExifByteOrderBiMap,
  ExifDataTypeBiMap,
} from "libexif-wasm/enums";
import * as z from "zod";

const tagSchema = z.toZod<Tag>()(
  z.enum(Array.from(ExifTagUnifiedBiMap.keys())),
);

const supportLevelSchema = z.toZod<SupportLevel>()(
  z.enum(Array.from(ExifSupportLevelBiMap.keys())),
);

const ifdSchema = z.toZod<Ifd>()(
  z.enum(Array.from(ExifIfdBiMap.keys()).filter((v) => v !== "COUNT")),
);

const byteOrderSchema = z.toZod<ByteOrder>()(
  z.enum(Array.from(ExifByteOrderBiMap.keys())),
);

const formatSchema = z.toZod<Format>()(
  z.enum(Array.from(ExifFormatBiMap.keys())),
);

const dataTypeSchema = z.toZod<DataType>()(
  z.enum(Array.from(ExifDataTypeBiMap.keys()).filter((v) => v !== "COUNT")),
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
