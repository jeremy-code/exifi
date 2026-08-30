import { encode } from "iconv-lite";

import { assertNever } from "@exifi/utils/assertNever";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import type { UserComment } from "./interfaces";

const textEncoder = new TextEncoder();

const formatUserComment = (userComment: UserComment): Uint8Array => {
  switch (userComment.encoding) {
    case "ASCII": {
      const buffer = encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
        "ASCII",
      ) as Uint8Array;

      return new Uint8Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      );
    }
    case "UNICODE":
    case "EMPTY":
      return textEncoder.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    case "JIS": {
      // Since JIS is compatible with ASCII, encoding header can be encoded with
      // same encoder
      const buffer = encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
        "eucjp",
      ) as Uint8Array;

      return new Uint8Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      );
    }
    default:
      assertNever(userComment.encoding);
  }
};

export { formatUserComment };
