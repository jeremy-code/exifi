import type { Fixture } from "./interfaces";

// The keys are the resolved globs and the values are promises that resolve to
// strings beginning with `/@fs/` followed by the absolute URL of the files on
// the system
const FIXTURES = import.meta.glob(["../fixtures/*/*"], {
  import: "default",
  query: "?url",
});

const fetchFile = (fileUrl: string) =>
  fetch(new URL(fileUrl, new URL(import.meta.url).origin));

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
    fetchFile(imageUrl).then(
      async (res) => new Uint8Array(await res.arrayBuffer()),
    ),
    jsonUrl !== undefined
      ? fetchFile(jsonUrl).then(
          (res) => res.json() as Promise<Record<PropertyKey, unknown>>,
        )
      : undefined,
    exifUrl !== undefined
      ? fetchFile(exifUrl).then(
          async (res) => new Uint8Array(await res.arrayBuffer()),
        )
      : undefined,
  ]);

  return { image, json, exifBytes };
};

export { getFixture };
