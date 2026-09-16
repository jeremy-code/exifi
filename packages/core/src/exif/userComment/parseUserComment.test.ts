import { SHIFT_JIS } from "iconv-tiny";
import { describe, expect, test } from "vitest";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import { parseUserComment } from "./parseUserComment";

const textEncoder = new TextEncoder();
const shiftJis = SHIFT_JIS.create();

describe("parseUserComment", () => {
  test.for([
    { encoding: "ASCII", value: "Hello world" },
    { encoding: "UNICODE", value: "Hello 🦖" },
    { encoding: "EMPTY", value: "" },
    { encoding: "JIS", value: "ジョジョの奇妙な冒険" },
  ] as const)("parses $encoding user comment", ({ encoding, value }) => {
    const userCommentBytes =
      encoding === "JIS"
        ? shiftJis.encode(`${ENCODING_TO_HEADER_MAP[encoding]}${value}`)
        : textEncoder.encode(`${ENCODING_TO_HEADER_MAP[encoding]}${value}`);

    expect(parseUserComment(userCommentBytes)).toStrictEqual({
      encoding,
      value,
    });
  });

  test("defaults to UNICODE when header is unknown", () => {
    const unknownHeader = textEncoder.encode("INVALID!");
    const value = "Hello 🦖";

    const bytes = new Uint8Array([
      ...unknownHeader,
      ...textEncoder.encode(value),
    ]);

    expect(parseUserComment(bytes)).toStrictEqual({
      encoding: "UNICODE",
      value,
    });
  });

  test("supports generic iterable input", () => {
    const value = "Hello";
    const bytes = textEncoder.encode(`${ENCODING_TO_HEADER_MAP.ASCII}${value}`);

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
          ? shiftJis.encode(ENCODING_TO_HEADER_MAP[encoding])
          : textEncoder.encode(ENCODING_TO_HEADER_MAP[encoding]);

      expect(parseUserComment(bytes)).toStrictEqual({ encoding, value: "" });
    },
  );
});
