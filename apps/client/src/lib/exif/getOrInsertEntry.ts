import { ExifEntry, type ExifContent, type Tag } from "libexif-wasm";

const getOrInsertEntry = (exifContent: ExifContent, exifTag: Tag) => {
  let exifEntry = exifContent.getEntry(exifTag);

  if (exifEntry === null) {
    exifEntry = ExifEntry.new();
    exifEntry.tag = exifTag;
    exifContent.addEntry(exifEntry);
    exifEntry.parent = exifContent;
  }

  return exifEntry;
};

export { getOrInsertEntry };
