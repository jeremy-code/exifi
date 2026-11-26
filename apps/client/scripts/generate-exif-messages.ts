import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  exifByteOrderGetName,
  exifFormatGetName,
  exifIfdGetName,
  exifSupportLevelGetName,
  getExifTagTable,
  IFD_NAMES,
  type Tag,
  type Ifd,
  type SupportLevel,
  type Format,
  type ByteOrder,
  type DataType,
} from "libexif-wasm";
import {
  ExifByteOrderBiMap,
  ExifDataTypeBiMap,
  ExifFormatBiMap,
  ExifSupportLevelBiMap,
} from "libexif-wasm/enums";
import { format } from "oxfmt";

import { DATA_TYPE_MAP } from "@exifi/core/exif/constants";
import {
  EXIF_TAG_MAP,
  type ExifTagInformation,
} from "@exifi/core/exif/exifTagMap";

import oxfmtConfig from "../../../oxfmt.config";

const CLIENT_DIR = fileURLToPath(new URL("..", import.meta.url));

const escapeInlangMessage = (text: string): string =>
  text.replaceAll("{", "\\{").replaceAll("}", "\\}");

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const MANUAL_MESSAGES: Record<string, string> = {
  exif_unknown_tag: "Unknown tag",
};

const messages: Record<string, string> = {
  ...MANUAL_MESSAGES,
};

const addMessage = (key: string, text: string): void => {
  const escapedMessage = escapeInlangMessage(text);
  if (key in messages && messages[key] !== escapedMessage) {
    throw new Error(`Message key collision: ${key}`);
  }
  messages[key] = escapedMessage;
};

type MessageRecords = {
  tagTitles: Record<Tag, string>;
  tagDescriptions: Record<Tag, string>;
  ifdNames: Record<Ifd, string>;
  supportLevelNames: Record<SupportLevel, string>;
  formatNames: Record<Format, string>;
  byteOrderNames: Record<ByteOrder, string>;
  dataTypeNames: Record<DataType, string>;
  enumValues: Record<string, Record<string, string>>;
};

const messageRecords = {
  tagTitles: {},
  tagDescriptions: {},
  ifdNames: {},
  supportLevelNames: {},
  formatNames: {},
  byteOrderNames: {},
  dataTypeNames: {},
  enumValues: {},
} as MessageRecords;

getExifTagTable().forEach((tagEntry) => {
  if (tagEntry.title !== "") {
    const messageKey = `exif_tag_title_${slugify(tagEntry.tag)}`;
    addMessage(messageKey, tagEntry.title);
    messageRecords.tagTitles[tagEntry.tag] = messageKey;
  }

  if (tagEntry.description !== "") {
    const messageKey = `exif_tag_description_${slugify(tagEntry.tag)}`;
    addMessage(messageKey, tagEntry.description);
    messageRecords.tagDescriptions[tagEntry.tag] = messageKey;
  }
});

IFD_NAMES.forEach((ifdName) => {
  const messageKey = `exif_ifd_name_${slugify(ifdName)}`;
  addMessage(messageKey, exifIfdGetName(ifdName));
  messageRecords.ifdNames[ifdName] = messageKey;
});

Array.from(ExifSupportLevelBiMap.keys()).forEach((exifSupportLevel) => {
  const messageKey = `exif_support_level_${slugify(exifSupportLevel)}`;
  addMessage(messageKey, exifSupportLevelGetName(exifSupportLevel));
  messageRecords.supportLevelNames[exifSupportLevel] = messageKey;
});

Array.from(ExifFormatBiMap.keys()).forEach((exifFormat) => {
  const messageKey = `exif_format_${slugify(exifFormat)}`;
  addMessage(messageKey, exifFormatGetName(exifFormat));
  messageRecords.formatNames[exifFormat] = messageKey;
});

Array.from(ExifByteOrderBiMap.keys()).forEach((byteOrder) => {
  const messageKey = `exif_byte_order_${slugify(byteOrder)}`;
  addMessage(messageKey, exifByteOrderGetName(byteOrder));
  messageRecords.byteOrderNames[byteOrder] = messageKey;
});

Array.from(ExifDataTypeBiMap.keys()).forEach((dataType) => {
  if (dataType !== "COUNT") {
    const messageKey = `exif_data_type_${slugify(dataType)}`;
    addMessage(messageKey, DATA_TYPE_MAP[dataType]);
    messageRecords.dataTypeNames[dataType] = messageKey;
  }
});

(Object.entries(EXIF_TAG_MAP) as [Tag, ExifTagInformation][]).forEach(
  ([tag, tagInfo]) =>
    [
      ...Object.keys(tagInfo.values ?? {}),
      ...Object.keys(tagInfo.asciiValues ?? {}),
    ].forEach((label) => {
      const enumValues = (messageRecords.enumValues[tag] ??= {});

      const messageKey = `exif_enum_${slugify(tag)}_${slugify(label)}`;
      addMessage(messageKey, label);
      enumValues[label] = messageKey;
    }),
);

const json = {
  $schema: "https://inlang.com/schema/inlang-message-format",
  ...messages,
};

await writeFile(
  resolve(CLIENT_DIR, "messages/exif/en.json"),
  (await format("en.json", JSON.stringify(json), oxfmtConfig)).code,
);

const renderRecord = (
  name: string,
  type: string,
  record: { [key: string]: string | Record<string, string> },
): string => {
  const lines = Object.entries(record).map(([id, value]) => {
    if (typeof value === "string") {
      return `${JSON.stringify(id)}: m.${value},`;
    }

    return `${JSON.stringify(id)}: { ${Object.entries(value)
      .map(
        ([nestedId, messageKey]) =>
          `${JSON.stringify(nestedId)}: m.${messageKey},`,
      )
      .join("\n")} },`;
  });

  return `const ${name}: ${type} = {${lines.join("\n")}};`;
};

const exifMessagesTs = `// GENERATED FILE - DO NOT EDIT. Run \`pnpm run generate-exif-messages\`.
import type {
  DataType,
  ByteOrder,
  Format,
  Ifd,
  SupportLevel,
  Tag,
} from "libexif-wasm";

import { m } from "#paraglide/messages";
import type { LocalizedString } from "#paraglide/runtime";

type MessageFn = () => LocalizedString;

${renderRecord("EXIF_TAG_TITLES", "Partial<Record<Tag, MessageFn>>", messageRecords.tagTitles)}

${renderRecord("EXIF_TAG_DESCRIPTIONS", "Partial<Record<Tag, MessageFn>>", messageRecords.tagDescriptions)}

${renderRecord("EXIF_IFD_NAMES", "Record<Ifd, MessageFn>", messageRecords.ifdNames)}

${renderRecord("EXIF_SUPPORT_LEVEL_NAMES", "Record<SupportLevel, MessageFn>", messageRecords.supportLevelNames)}

${renderRecord("EXIF_FORMAT_NAMES", "Record<Format, MessageFn>", messageRecords.formatNames)}

${renderRecord("EXIF_BYTE_ORDER_NAMES", "Record<ByteOrder, MessageFn>", messageRecords.byteOrderNames)}

${renderRecord("EXIF_DATA_TYPE_NAMES", "Record<DataType, MessageFn>", messageRecords.dataTypeNames)}

${renderRecord("EXIF_ENUM_VALUE_LABELS", "Partial<Record<Tag, Record<string, MessageFn>>>", messageRecords.enumValues)}

export {
  EXIF_TAG_TITLES,
  EXIF_TAG_DESCRIPTIONS,
  EXIF_IFD_NAMES,
  EXIF_SUPPORT_LEVEL_NAMES,
  EXIF_FORMAT_NAMES,
  EXIF_BYTE_ORDER_NAMES,
  EXIF_DATA_TYPE_NAMES,
  EXIF_ENUM_VALUE_LABELS,
};
`;

await writeFile(
  resolve(CLIENT_DIR, "src/lib/exif/exifMessages.generated.ts"),
  (await format("exifMessages.generated.ts", exifMessagesTs, oxfmtConfig)).code,
);

console.log(
  `Wrote ${Object.keys(messages).length} messages (${Object.keys(messageRecords.tagTitles).length} titles, ${Object.keys(messageRecords.tagDescriptions).length} descriptions).`,
);
