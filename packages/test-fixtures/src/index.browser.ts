import { server } from "vitest/browser";

import type { Fixture } from "./interfaces";

const { readFile } = server.commands;

// The keys are the resolved globs and the values are strings beginning with
// `/@fs/` followed by the absolute URL of the files on the system
const FIXTURES = import.meta.glob(["../fixtures/*/*"], {
  eager: true,
  import: "default",
  query: "?url",
});

const getFixture = async (fixtureName: string): Promise<Fixture> => {
  const fixturePaths = Object.keys(FIXTURES).flatMap((fixturePath) =>
    fixturePath.startsWith(`../fixtures/${fixtureName}`)
      ? /**
         * `readFile` in Vitest resolves to the "project root", which is not at
         * the monorepo root but at each package's vitest.config.ts location, even
         * when using projects configuration
         *
         * @see {@link https://vitest.dev/api/browser/commands.html#files-handling}
         */
        [`../../packages/test-fixtures/${fixturePath.slice("..".length)}`]
      : [],
  );

  let imagePath: string | undefined;
  let jsonPath: string | undefined;
  let exifPath: string | undefined;

  fixturePaths.forEach((fixturePath) => {
    if (fixturePath.endsWith(".json")) {
      jsonPath = fixturePath;
    } else if (fixturePath.endsWith(".exif")) {
      exifPath = fixturePath;
    } else {
      imagePath = fixturePath;
    }
  });

  if (imagePath === undefined) {
    throw new Error(`${fixtureName} is not a valid fixture`);
  }

  const [image, json, exifBytes] = await Promise.all([
    readFile(imagePath, { encoding: "base64" }),
    jsonPath !== undefined
      ? readFile(jsonPath, { encoding: "utf-8" }).then(
          (file) => JSON.parse(file) as Record<PropertyKey, unknown>,
        )
      : undefined,
    exifPath !== undefined
      ? readFile(exifPath, { encoding: "base64" })
      : undefined,
  ]);

  return {
    image: Uint8Array.fromBase64(image),
    json,
    exifBytes:
      exifBytes !== undefined ? Uint8Array.fromBase64(exifBytes) : undefined,
  };
};

export { getFixture };
