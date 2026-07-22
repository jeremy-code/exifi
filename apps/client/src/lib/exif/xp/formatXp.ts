import { encode } from "iconv-lite";

const formatXp = (input: string) => {
  const inputWithNullTerminator = input.endsWith("\u0000")
    ? input
    : input + "\u0000";
  const buffer = encode(inputWithNullTerminator, "utf16le") as Uint8Array;

  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

export { formatXp };
