import type { ByteOrder, DataType, Format, Ifd, Tag } from "libexif-wasm";

type ExifVersion = {
  major: number;
  minor: number;
};

// JSON-serializable version of ExifEntry
type ExifEntryObject = {
  ifd: Ifd;
  tag: Tag;
  format: Format;
  components: number;
  data: number[];
  size: number;
  value: number[];
  formattedValue: string | null;
  byteOrder: ByteOrder;
};

type ExifIfdObject = Record<Ifd, ExifEntryObject[]>;

// JSON-serializable version of ExifData
type ExifDataObject = {
  ifd: ExifIfdObject;
  data: number[];
  dataType: DataType | null;
  byteOrder: ByteOrder | null;
};

export type { ExifVersion, ExifEntryObject, ExifIfdObject, ExifDataObject };
