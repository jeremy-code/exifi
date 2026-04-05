import type { ExifContent, ExifEntry, Tag } from "libexif-wasm";

const getRequiredEntry = (
  exifContent: ExifContent,
  exifTag: Tag,
): ExifEntry => {
  const exifEntry = exifContent.getEntry(exifTag);

  if (exifEntry === null) {
    throw new Error(
      `Required tag "${exifTag}" was not found in ifd ${exifContent.ifd}.`,
    );
  }
  return exifEntry;
};

export { getRequiredEntry };
