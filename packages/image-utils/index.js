import imageUtilsFactory from "./dist/imageUtils.js";
import { readFile, writeFile } from "fs/promises";
import { glob } from "fs/promises";
import { ExifData } from "libexif-wasm";
import { serializeExifData } from "./serializeExifData.ts";

const filePaths = await Array.fromAsync(glob("./fixtures/*.png"));

const files = await Promise.all(filePaths.map((path) => readFile(path)));

const imageUtils = await imageUtilsFactory();

console.log(files);

files.forEach(async (file, i) => {
  const output = imageUtils.png_get_exif_data(file);

  if (output !== undefined) {
    const exifData = ExifData.newFromData(output);
    await writeFile(
      `${filePaths[i]}.json`,
      JSON.stringify(serializeExifData(exifData)),
    );
    exifData.free();
  }
});

// console.log(
//   imageUtils.png_get_exif_data(
//     await readFile("./CillianMurphy-TIFF2025-01.png"),
//   ),
// );

// const exifData = ExifData.newFromData(imageUtils.png_get_exif_data(file));
// exifData.free();
