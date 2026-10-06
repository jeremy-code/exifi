import * as iconv from "iconv-nano";
import { describe, expect, test } from "vitest";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import { parseUserComment } from "./parseUserComment";

describe("parseUserComment", () => {
  test.for([
    { encoding: "ASCII", value: "Hello world" },
    { encoding: "UNICODE", value: "Hello 🦖" },
    { encoding: "EMPTY", value: "" },
    { encoding: "JIS", value: "ジョジョの奇妙な冒険" },
  ] as const)("parses $encoding user comment", ({ encoding, value }) => {
    const userCommentBytes =
      encoding === "JIS"
        ? iconv.shift_jis.encode(`${ENCODING_TO_HEADER_MAP[encoding]}${value}`)
        : iconv.utf8.encode(`${ENCODING_TO_HEADER_MAP[encoding]}${value}`);

    expect(parseUserComment(userCommentBytes)).toStrictEqual({
      encoding,
      value,
    });
  });

  test("defaults to UNICODE when header is unknown", () => {
    const unknownHeader = iconv.utf8.encode("INVALID!");
    const value = "Hello 🦖";

    const bytes = new Uint8Array([
      ...unknownHeader,
      ...iconv.utf8.encode(value),
    ]);

    expect(parseUserComment(bytes)).toStrictEqual({
      encoding: "UNICODE",
      value,
    });
  });

  test("supports generic iterable input", () => {
    const value = "Hello";
    const bytes = iconv.utf8.encode(`${ENCODING_TO_HEADER_MAP.ASCII}${value}`);

    function* iterable() {
      yield* bytes;
    }

    expect(parseUserComment(iterable())).toStrictEqual({
      encoding: "ASCII",
      value,
    });
  });

  test.for([["ASCII"], ["UNICODE"], ["EMPTY"], ["JIS"]] as const)(
    "parses header-only %s comment as empty string",
    ([encoding]) => {
      const bytes =
        encoding === "JIS"
          ? iconv.shift_jis.encode(ENCODING_TO_HEADER_MAP[encoding])
          : iconv.utf8.encode(ENCODING_TO_HEADER_MAP[encoding]);

      expect(parseUserComment(bytes)).toStrictEqual({ encoding, value: "" });
    },
  );
});
