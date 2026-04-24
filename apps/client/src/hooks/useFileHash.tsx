import { use, useMemo } from "react";

import { sha256 } from "hash-wasm";

// Needed to ensure the promise is stably cached for the same file across
// multiple calls to useFileHash
const fileHashPromiseCache = new WeakMap<File, Promise<string>>();

const getFileHashPromise = (file: File) => {
  let fileHashPromise = fileHashPromiseCache.get(file);
  if (fileHashPromise === undefined) {
    fileHashPromise = file
      .arrayBuffer()
      .then((arrayBuffer) => sha256(new Uint8Array(arrayBuffer)));
    fileHashPromiseCache.set(file, fileHashPromise);
  }
  return fileHashPromise;
};

const useFileHash = (file: File) => {
  const fileHashPromise = useMemo(() => getFileHashPromise(file), [file]);
  const fileHash = use(fileHashPromise);
  return fileHash;
};

export { useFileHash };
