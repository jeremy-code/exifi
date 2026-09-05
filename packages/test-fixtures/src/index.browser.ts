import type { Fixture } from "./interfaces";

// The keys are the resolved globs and the values are promises that resolve to
// strings beginning with `/@fs/` and followed by the absolute URL of the files
// on the system
const FIXTURES = import.meta.glob("../fixtures/*/*", {
  import: "default",
  query: "?url",
});

const fetchFile = async (fileUrl: string): Promise<string> => {
  console.log(new URL(import.meta.url).origin);
  const response = await fetch(
    new URL(
      fileUrl,
      // http://localhost:63315 (Vitest browser dev server)
      new URL(import.meta.url).origin,
    ),
  );

  if (!response.ok) {
    throw new Error(
      `An error occurred while attempting to fetch file: ${fileUrl}`,
      { cause: new Error(response.statusText) },
    );
  }

  return fileUrl.endsWith(".json")
    ? response.text()
    : // Response.bytes() by default is `Uint8Array<ArrayBufferLike>`. By
      // converting it to Base64, the output is always `string` and we are
      // guaranteed to receive a `Uint8Array<ArrayBuffer>`
      (await response.bytes()).toBase64();
};

const getFixture = async (fixtureName: string): Promise<Fixture> => {
  const fixtureUrls = await Promise.all(
    Object.entries(FIXTURES).flatMap(([fixturePath, fixtureUrlCb]) =>
      fixturePath.startsWith(`../fixtures/${fixtureName}`)
        ? [fixtureUrlCb()]
        : [],
    ),
  );
  const {
    image: imageUrl,
    exifBytes: exifUrl,
    json: jsonUrl,
  } = fixtureUrls.reduce<{ [Property in keyof Fixture]?: string }>(
    (acc, fixtureUrl) => {
      if (fixtureUrl.endsWith(".json")) {
        acc["json"] = fixtureUrl;
      } else if (fixtureUrl.endsWith(".exif")) {
        acc["exifBytes"] = fixtureUrl;
      } else {
        acc["image"] = fixtureUrl;
      }
      return acc;
    },
    {},
  );

  if (imageUrl === undefined) {
    throw new Error(`${fixtureName} is not a valid fixture`);
  }

  const [image, json, exifBytes] = await Promise.all([
    fetchFile(imageUrl).then((file) => Uint8Array.fromBase64(file)),
    jsonUrl !== undefined
      ? fetchFile(jsonUrl).then(
          (file) => JSON.parse(file) as Record<PropertyKey, unknown>,
        )
      : undefined,
    exifUrl !== undefined
      ? fetchFile(exifUrl).then((file) => Uint8Array.fromBase64(file))
      : undefined,
  ]);

  return { image, json, exifBytes };
};

export { getFixture };
