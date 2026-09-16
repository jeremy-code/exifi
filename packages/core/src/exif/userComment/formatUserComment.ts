import { SHIFT_JIS, US_ASCII } from "iconv-tiny";

import { assertNever } from "@exifi/utils/assertNever";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import type { UserComment } from "./interfaces";

const usAscii = US_ASCII.create();
const shiftJis = SHIFT_JIS.create();

const textEncoder = new TextEncoder();

const formatUserComment = (userComment: UserComment): Uint8Array => {
  switch (userComment.encoding) {
    case "ASCII": {
      return usAscii.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    }
    case "UNICODE":
    case "EMPTY":
      return textEncoder.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    case "JIS": {
      // Encoding header can be encoded with same encoder
      // 0x4a 0x49 0x53 0x00 0x00 0x00 0x00 0x00
      return shiftJis.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    }
    default:
      assertNever(userComment.encoding);
  }
};

export { formatUserComment };
