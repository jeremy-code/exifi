import { use, useMemo } from "react";

import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

// Needed to ensure the promise is stably cached for the same file across
// multiple calls to useFileHash
const fileHashPromiseCache = new WeakMap<File, Promise<string>>();

const getFileHashPromise = (file: File) => {
  let fileHashPromise = fileHashPromiseCache.get(file);
  if (fileHashPromise === undefined) {
    fileHashPromise = file.arrayBuffer().then(async (arrayBuffer) => {
      /**
       * Hashes function using native WebCrypto if available (not avaliable in
       * non-secure contexts, mostly for development), otherwise uses sha256
       * from @noble/hashes
       */
      const hash =
        "subtle" in crypto && "digest" in crypto.subtle
          ? new Uint8Array(await crypto.subtle.digest("SHA-256", arrayBuffer))
          : sha256(new Uint8Array(arrayBuffer));

      return bytesToHex(hash); // bytesToHex uses Uint8Array.toHex if avaliable
    });
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
