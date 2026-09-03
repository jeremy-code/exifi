import { readFile } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";

const getFixture = async (path: string) => {
  const [image, data] = await Promise.all([
    readFile(resolve("fixtures", path)),
    // import(`./fixtures/${basename(path, extname(path))}.json`, {
    //   with: {
    //     type: "json",
    //   },
    // }),
  ]);

  return { image };
};

export { getFixture };
