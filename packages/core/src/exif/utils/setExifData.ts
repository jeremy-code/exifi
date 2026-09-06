import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

import { writeExifData } from "@exifi/exif-utils";

const setExifData = async (file: File, exifData: ExifData): Promise<File> => {
  const fileType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(extname(file.name));
  const fileBytes = await file.bytes();
  const exifDataBytes = exifData.saveData();

  if (fileType === "image/jpeg") {
    const newFileBytes = writeExifData(fileBytes, exifDataBytes);

    return new File([newFileBytes.slice()], file.name, {
      type: fileType,
      lastModified: new Date().getTime(),
    });
  }

  return file;
};

export { setExifData };
