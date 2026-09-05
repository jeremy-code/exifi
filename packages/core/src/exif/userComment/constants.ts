import type { Encoding } from "./interfaces";

const ENCODING_TO_HEADER_MAP = {
  ASCII: "ASCII\0\0\0",
  UNICODE: "UNICODE\0",
  JIS: "JIS\0\0\0\0\0", // JIS X208-1990 (JEITA CP-3451 p.28)
  EMPTY: "\0\0\0\0\0\0\0\0", // Should be ASCII
} as const satisfies Record<Encoding, string>;

export { ENCODING_TO_HEADER_MAP };
