import { encode } from "iconv-lite";
import { describe, expect, test } from "vitest";

import { ENCODING_TO_HEADER_MAP } from "./constants";
import { formatUserComment } from "./formatUserComment";
import { parseUserComment } from "./parseUserComment";

const textEncoder = new TextEncoder();

const ASCII_CHARS = Array.from({ length: 128 }, (_, i) =>
  String.fromCharCode(i),
);

const HEADER_LENGTH = 8;

describe("formatUserComment", () => {
  test.for([
    [{ encoding: "ASCII", value: "" }],
    [{ encoding: "EMPTY", value: "" }],
    [{ encoding: "JIS", value: "" }],
    [{ encoding: "UNICODE", value: "" }],
  ] as const)("formats %s UserComment with correct header", ([userComment]) => {
    expect(formatUserComment(userComment)).toStrictEqual(
      textEncoder.encode(ENCODING_TO_HEADER_MAP[userComment.encoding]),
    );
  });

  describe.for([
    [{ encoding: "ASCII", value: ASCII_CHARS.join("") }],
    [{ encoding: "UNICODE", value: ASCII_CHARS.join("") + "🦖" }],
    [{ encoding: "EMPTY", value: ASCII_CHARS.join("") }],
    [{ encoding: "JIS", value: ASCII_CHARS.join("") + "ジョジョの奇妙な冒険" }],
  ] as const)("formats %s UserComment with correct value", ([userComment]) => {
    test("formats UserComment data", () => {
      expect(
        formatUserComment(userComment).subarray(HEADER_LENGTH),
      ).toStrictEqual(
        userComment.encoding === "JIS"
          ? new Uint8Array(encode(userComment.value, "eucjp"))
          : textEncoder.encode(userComment.value),
      );
    });
    test("is parsed correctly by parseUserComment", () => {
      expect(parseUserComment(formatUserComment(userComment))).toStrictEqual(
        userComment,
      );
    });
  });
});
