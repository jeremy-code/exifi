import { arrayLikeEquals } from "@exifi/utils/arrayLikeEquals";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import type { UserComment } from "./interfaces";

const textDecoder = new TextDecoder();
const textDecoderJis = new TextDecoder("euc-jp");

const textEncoder = new TextEncoder();

const DECODERS = [
  {
    encoding: "ASCII",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.ASCII),
    decoder: textDecoder,
  },
  {
    encoding: "UNICODE",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.UNICODE),
    decoder: textDecoder,
  },
  {
    encoding: "EMPTY",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.EMPTY),
    decoder: textDecoder,
  },
  {
    encoding: "JIS",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.JIS),
    decoder: textDecoderJis,
  },
] as const;

const parseUserComment = (data: Iterable<number>): UserComment => {
  const bytes = Uint8Array.from(data);
  const header = bytes.subarray(0, 8);
  const value = bytes.subarray(8);

  const match = DECODERS.find(({ header: expectedHeader }) =>
    arrayLikeEquals(header, expectedHeader),
  );

  if (match !== undefined) {
    return {
      encoding: match.encoding,
      value: match.decoder.decode(value),
    };
  }

  return {
    encoding: "UNICODE",
    value: textDecoder.decode(value),
  };
};

export { parseUserComment, type UserComment };
