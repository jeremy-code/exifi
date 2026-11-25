import { describe, expect, test } from "vitest";

import { concatUint8Arrays } from "./concatUint8Arrays";

describe("concatUint8Arrays", () => {
  test("concats two Uint8Array objects", () => {
    const textEncoder = new TextEncoder();
    const buffers = [textEncoder.encode("Hello "), textEncoder.encode("World")];
    const output = concatUint8Arrays(buffers);
    expect(output).toEqual(textEncoder.encode("Hello World"));
  });

  test("concats empty arrays", () => {
    const buffers = [new Uint8Array(), new Uint8Array()];
    const output = concatUint8Arrays(buffers);
    expect(output).toHaveProperty("byteLength", 0);
    expect(output).not.toBe(buffers[0]);
    expect(output).not.toBe(buffers[1]);
  });

  test("concats multiple Uint8Array objects", () => {
    const textEncoder = new TextEncoder();
    const buffers = [
      textEncoder.encode("Hello "),
      textEncoder.encode("W"),
      textEncoder.encode("o"),
      textEncoder.encode("r"),
      textEncoder.encode("l"),
      textEncoder.encode("d"),
    ];
    const output = concatUint8Arrays(buffers);
    expect(output).toEqual(textEncoder.encode("Hello World"));
  });

  test("always returns new Uint8Array", () => {
    const buffers = [new Uint8Array()];
    const output = concatUint8Arrays(buffers);
    expect(output).not.toBe(buffers[0]);
  });
});
