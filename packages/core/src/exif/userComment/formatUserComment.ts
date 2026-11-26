import * as iconv from "iconv-nano";

import { assertNever } from "@exifi/utils/assertNever";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import type { UserComment } from "./interfaces";

const formatUserComment = (userComment: UserComment): Uint8Array => {
  switch (userComment.encoding) {
    case "ASCII": {
      return iconv.ascii.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    }
    case "UNICODE":
      return concatUint8Arrays([
        iconv.utf8.encode(ENCODING_TO_HEADER_MAP[userComment.encoding]),
        iconv.utf_16be.encode(userComment.value),
      ]);
    case "EMPTY":
      return iconv.utf8.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    case "JIS": {
      // Encoding header can be encoded with same encoder
      // 0x4a 0x49 0x53 0x00 0x00 0x00 0x00 0x00
      return iconv.shift_jis.encode(
        `${ENCODING_TO_HEADER_MAP[userComment.encoding]}${userComment.value}`,
      );
    }
    default:
      assertNever(userComment.encoding);
  }
};

export { formatUserComment };
