import { use, useMemo } from "react";

import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

// Needed to ensure the promise is stably cached for the same file across
// multiple calls to useFileHash
const fileHashPromiseCache = new WeakMap<File, Promise<string>>();

const getFileHash = async (file: File): Promise<string> => {
  // Blob.arrayBuffer has better support in browsers than Blob.bytes()
  const arrayBuffer = await file.arrayBuffer();
  /**
   * Hashes function using native WebCrypto if available (not avaliable in
   * non-secure contexts, mostly for development), otherwise uses sha256
   * from @noble/hashes
   */
  const fileHashBytes =
    "subtle" in crypto && "digest" in crypto.subtle
      ? new Uint8Array(await crypto.subtle.digest("SHA-256", arrayBuffer))
      : sha256(new Uint8Array(arrayBuffer));

  return bytesToHex(fileHashBytes); // bytesToHex uses Uint8Array.toHex if avaliable
};

const getFileHashPromise = (file: File): Promise<string> => {
  let fileHashPromise = fileHashPromiseCache.get(file);
  if (fileHashPromise === undefined) {
    fileHashPromise = getFileHash(file);
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
