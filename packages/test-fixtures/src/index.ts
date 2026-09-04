import { glob, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

type Fixture = {
  image: Uint8Array<ArrayBuffer>;
  json: Record<PropertyKey, unknown> | undefined;
  exifBytes: Uint8Array<ArrayBuffer> | undefined;
};

const getFixture = async (fixtureName: string): Promise<Fixture> => {
  let imagePath: string | undefined;
  let jsonPath: string | undefined;
  let exifPath: string | undefined;

  for await (const fixturePath of glob(
    join(import.meta.dirname, "..", "fixtures", `${fixtureName}.*`),
  )) {
    const extension = extname(fixturePath);
    if (extension === ".json") {
      jsonPath = fixturePath;
    } else if (extension === ".exif") {
      exifPath = fixturePath;
    } else {
      imagePath = fixturePath;
    }
  }

  if (imagePath === undefined) {
    throw new Error(`${fixtureName} is not a valid fixture`);
  }

  const [image, json, exifBytes] = await Promise.all([
    readFile(imagePath),
    jsonPath !== undefined
      ? (import(jsonPath, { with: { type: "json" } }) as Promise<
          Record<PropertyKey, unknown>
        >)
      : undefined,
    exifPath !== undefined ? readFile(exifPath) : undefined,
  ]);

  return {
    image: new Uint8Array(image.buffer, image.byteOffset, image.length),
    json,
    exifBytes:
      exifBytes !== undefined
        ? new Uint8Array(
            exifBytes.buffer,
            exifBytes.byteOffset,
            exifBytes.length,
          )
        : undefined,
  };
};

export { getFixture };
