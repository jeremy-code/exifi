import { glob, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Fixture } from "./interfaces";

const FIXTURES_DIR = new URL("../fixtures", import.meta.url);

const getFixture = async (fixtureName: string): Promise<Fixture> => {
  const {
    image: imagePath,
    exifBytes: exifPath,
    json: jsonPath,
  } = (
    await Array.fromAsync(
      glob(join(fileURLToPath(FIXTURES_DIR), fixtureName, `${fixtureName}.*`)),
    )
  ).reduce<{ [Property in keyof Fixture]?: string }>((acc, fixturePath) => {
    const extension = extname(fixturePath).toLowerCase();
    if (extension === ".json") {
      acc["json"] = fixturePath;
    } else if (extension === ".exif") {
      acc["exifBytes"] = fixturePath;
    } else {
      acc["image"] = fixturePath;
    }
    return acc;
  }, {});

  if (imagePath === undefined) {
    throw new Error(`${fixtureName} is not a valid fixture`);
  }

  const [image, json, exifBytes] = await Promise.all([
    readFile(imagePath),
    jsonPath !== undefined
      ? (import(jsonPath, { with: { type: "json" } }).then(
          (mod) => mod.default,
        ) as Promise<Record<PropertyKey, unknown>>)
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
