/// <reference lib="DOM" />
// https://github.com/microsoft/TypeScript/issues/31535

import { arrayLikeEquals } from "@exifi/utils/arrayLikeEquals";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import type { UserComment } from "./interfaces";

const textDecoderUtf8 = new TextDecoder();
const textDecoderUtf16Be = new TextDecoder("utf-16be");
const textDecoderJis = new TextDecoder("shift-jis");

const textEncoder = new TextEncoder();

const DECODERS = [
  {
    encoding: "ASCII",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.ASCII),
    decoder: textDecoderUtf8,
  },
  {
    encoding: "UNICODE",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.UNICODE),
    decoder: textDecoderUtf16Be,
  },
  {
    encoding: "EMPTY",
    header: textEncoder.encode(ENCODING_TO_HEADER_MAP.EMPTY),
    decoder: textDecoderUtf8,
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
    return { encoding: match.encoding, value: match.decoder.decode(value) };
  }

  return { encoding: "UNICODE", value: textDecoderUtf16Be.decode(value) };
};

export { parseUserComment, type UserComment };
