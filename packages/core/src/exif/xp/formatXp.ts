import * as iconv from "iconv-nano";

const formatXp = (input: string) => {
  const inputWithNullTerminator = input.endsWith("\u0000")
    ? input
    : input + "\u0000";
  return iconv.utf_16le.encode(inputWithNullTerminator);
};

export { formatXp };
