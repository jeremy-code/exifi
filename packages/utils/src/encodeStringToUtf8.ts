/// <reference lib="DOM" />
// https://github.com/microsoft/TypeScript/issues/31535

const textEncoder = new TextEncoder();

const encodeStringToUtf8 = (input: string) => {
  return textEncoder.encode(
    input.endsWith("\u0000") ? input : input + "\u0000",
  );
};

export { encodeStringToUtf8 };
