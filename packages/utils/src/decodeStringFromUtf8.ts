const textDecoder = new TextDecoder("utf-8");

const decodeStringFromUtf8 = (...params: Parameters<TextDecoder["decode"]>) => {
  const output = textDecoder.decode(...params);

  if (output.at(-1) === "\u0000") {
    return output.slice(0, -1);
  }
  return output;
};

export { decodeStringFromUtf8 };
