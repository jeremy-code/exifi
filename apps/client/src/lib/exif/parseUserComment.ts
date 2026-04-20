import { arrayLikeEquals } from "#utils/arrayLikeEquals";

const ASCII_HEADER = "ASCII\0\0\0";
const UNICODE_HEADER = "UNICODE\0";
const JIS_COMMENT = "JIS\0\0\0\0\0"; // JIS X208-1990
const EMPTY_HEADER = "\0\0\0\0\0\0\0\0"; // Should be ASCII

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const textDecoderJis = new TextDecoder("euc-jp");

const parseUserComment = (data: number[]) => {
  if (
    arrayLikeEquals(data.slice(0, 8), textEncoder.encode(ASCII_HEADER)) ||
    arrayLikeEquals(data.slice(0, 8), textEncoder.encode(UNICODE_HEADER)) ||
    arrayLikeEquals(data.slice(0, 8), textEncoder.encode(EMPTY_HEADER))
  ) {
    return textDecoder.decode(new Uint8Array(data.slice(8)));
  }
  if (arrayLikeEquals(data.slice(0, 8), textEncoder.encode(JIS_COMMENT))) {
    return textDecoderJis.decode(new Uint8Array(data.slice(8)));
  }

  throw new Error("Unknown");
};

export { parseUserComment };
