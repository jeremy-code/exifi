/// <reference lib="DOM" />
// https://github.com/microsoft/TypeScript/issues/31535

import type { ByteOrder } from "libexif-wasm";

import { arrayLikeEquals } from "@exifi/utils/arrayLikeEquals";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import type { UserComment } from "./interfaces";

const textDecoderUtf8 = new TextDecoder();
const textDecoderUtf16Le = new TextDecoder("utf-16le");
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
    decoderBe: textDecoderUtf16Be,
    decoderLe: textDecoderUtf16Le,
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

const parseUserComment = (
  data: Iterable<number>,
  byteOrder?: ByteOrder,
): UserComment => {
  const bytes = Uint8Array.from(data);
  const header = bytes.subarray(0, 8);
  const value = bytes.subarray(8);

  const match =
    DECODERS.find(({ header: expectedHeader }) =>
      arrayLikeEquals(header, expectedHeader),
    ) ?? DECODERS[1]; /* Default to UNICODE */

  if (match.encoding === "UNICODE") {
    return {
      encoding: match.encoding,
      value:
        byteOrder === "INTEL"
          ? match.decoderLe.decode(value)
          : match.decoderBe.decode(value),
    };
  }
  return { encoding: match.encoding, value: match.decoder.decode(value) };
};

export { parseUserComment, type UserComment };
