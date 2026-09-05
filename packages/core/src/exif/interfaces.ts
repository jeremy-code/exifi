import type {
  ByteOrder,
  DataType,
  Format,
  Ifd,
  RationalObject,
  Tag,
} from "libexif-wasm";

type ExifVersion = {
  major: number;
  minor: number;
};

// JSON-serializable version of ExifEntry
type ExifEntryObject = {
  ifd: Ifd;
  tag: Tag;
  components: number;
  data: number[];
  size: number;
  formattedValue: string | null;
  byteOrder: ByteOrder;
} & (
  | { format: "ASCII"; value: string }
  | { format: "RATIONAL" | "SRATIONAL"; value: RationalObject[] }
  | {
      format: Exclude<Format, "ASCII" | "RATIONAL" | "SRATIONAL">;
      value: number[];
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

export type { ExifVersion, ExifEntryObject, ExifIfdObject, ExifDataObject };
