import { UTF16LE } from "iconv-tiny";

const utf16le = UTF16LE.create();

const formatXp = (input: string) => {
  const inputWithNullTerminator = input.endsWith("\u0000")
    ? input
    : input + "\u0000";
  return utf16le.encode(inputWithNullTerminator);
};

export { formatXp };
