import { UTF16LE } from "iconv-tiny";

const utf16le = UTF16LE.create();

const parseXp = (input: Uint8Array) => {
  const output = utf16le.decode(input);

  if (output.at(-1) === "\u0000") {
    return output.slice(0, -1);
  }

  return output;
};

export { parseXp };
