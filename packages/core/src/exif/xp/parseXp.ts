import * as iconv from "iconv-nano";

const parseXp = (input: Uint8Array) => {
  const output = iconv.utf_16le.decode(input);

  if (output.at(-1) === "\u0000") {
    return output.slice(0, -1);
  }

  return output;
};

export { parseXp };
