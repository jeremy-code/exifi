import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

const getExifData = async (file: File): Promise<ExifData> => {
  const mimeType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(extname(file.name));
  const fileBytes = await file.bytes();

  if (mimeType === "image/jpeg") {
    return ExifData.newFromData(fileBytes);
  }

  return ExifData.newFromData(fileBytes);
};

export { getExifData };
