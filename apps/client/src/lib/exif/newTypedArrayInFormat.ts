import type { Format, ValidTypedArray } from "libexif-wasm";

const newTypedArrayInFormat = (
  elements: Iterable<number>,
  format: Format,
): ValidTypedArray => {
  switch (format) {
    case "ASCII":
    case "UNDEFINED":
    case "BYTE":
      return new Uint8Array(elements);
    case "SBYTE":
      return new Int8Array(elements);
    case "SHORT":
      return new Uint16Array(elements);
    case "SSHORT":
      return new Int16Array(elements);
    case "LONG":
    case "RATIONAL":
      return new Uint32Array(elements);
    case "SLONG":
    case "SRATIONAL":
      return new Int32Array(elements);
    case "DOUBLE":
    case "FLOAT":
      throw new Error("Unsupported data type");
    default:
      throw new Error("Format is an unexpected value");
  }
};

export { newTypedArrayInFormat };
