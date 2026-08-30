const textDecoder = new TextDecoder("utf-16le");

const parseXp = (input: AllowSharedBufferSource) => {
  const output = textDecoder.decode(input);

  if (output.at(-1) === "\u0000") {
    return output.slice(0, -1);
  }

  return output;
};

export { parseXp };
