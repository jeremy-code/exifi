import type { DataType, SupportLevel, Tag } from "libexif-wasm";

const MAX_INT32_VALUE = 0x7fffffff;

/**
 * Maximum value of a 32-bit unsigned integer
 */
const MAX_UINT32_VALUE = 0xffffffff;

const DATA_TYPE_MAP: Record<DataType, string> = {
  UNCOMPRESSED_CHUNKY: "Uncompressed chunky",
  UNCOMPRESSED_PLANAR: "Uncompressed planar",
  UNCOMPRESSED_YCC: "Uncompress YCC",
  COMPRESSED: "Compressed",
  UNKNOWN: "Unknown",
};

const SUPPORT_LEVEL_MAP: Record<SupportLevel, string> = {
  UNKNOWN: "Unknown",
  NOT_RECORDED: "Not recorded",
  MANDATORY: "Mandatory",
  OPTIONAL: "Optional",
};

const GEOLOCATION_TAGS: Tag[] = [
  "LATITUDE",
  "LONGITUDE",
  "ALTITUDE",
  "LONGITUDE_REF",
  "LATITUDE_REF",
  "ALTITUDE_REF",
];

export {
  MAX_INT32_VALUE,
  MAX_UINT32_VALUE,
  DATA_TYPE_MAP,
  SUPPORT_LEVEL_MAP,
  GEOLOCATION_TAGS,
};
