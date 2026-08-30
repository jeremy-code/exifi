import type {
  ByteOrder,
  DataType,
  Format,
  Ifd,
  RationalObject,
  Tag,
} from "libexif-wasm";

// JSON-serializable version of ExifEntry
type ExifEntryObject = {
  ifd: Ifd;
  tag: Tag;
  format: Format;
  components: number;
  data: number[];
  dataAsTypedArray: number[];
  size: number;
  value: number[] | string | RationalObject[];
  formattedValue: string;
  byteOrder: ByteOrder;
} & (
  | {
      format:
        | "BYTE"
        | "SHORT"
        | "LONG"
        | "SBYTE"
        | "UNDEFINED"
        | "SSHORT"
        | "SLONG"
        | "FLOAT"
        | "DOUBLE";
      value: number[];
    }
  | { format: "ASCII"; value: string }
  | {
      format: "RATIONAL" | "SRATIONAL";
      value: RationalObject[];
    }
);

type ExifIfdObject = Record<Ifd, ExifEntryObject[]>;

// JSON-serializable version of ExifData
type ExifDataObject = {
  ifd: ExifIfdObject;
  data: number[];
  dataType: DataType | null;
  byteOrder: ByteOrder | null;
};

export type { ExifEntryObject, ExifIfdObject, ExifDataObject };
