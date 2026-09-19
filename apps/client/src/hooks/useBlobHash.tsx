import { use, useMemo } from "react";

import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

// Needed to ensure the promise is stably cached for the same blob across
// multiple calls to useBlobHash
const blobHashPromiseCache = new WeakMap<Blob, Promise<string>>();

const getBlobHash = async (blob: Blob): Promise<string> => {
  // Blob.arrayBuffer has better support in browsers than Blob.bytes()
  const arrayBuffer = await blob.arrayBuffer();
  /**
   * Hashes function using native WebCrypto if available (not avaliable in
   * non-secure contexts, mostly for development), otherwise uses sha256
   * from @noble/hashes
   */
  const blobHashBytes =
    "subtle" in crypto && "digest" in crypto.subtle
      ? new Uint8Array(await crypto.subtle.digest("SHA-256", arrayBuffer))
      : sha256(new Uint8Array(arrayBuffer));

  return bytesToHex(blobHashBytes); // bytesToHex uses Uint8Array.toHex if avaliable
};

const getBlobHashPromise = (blob: Blob): Promise<string> => {
  let blobHashPromise = blobHashPromiseCache.get(blob);
  if (blobHashPromise === undefined) {
    blobHashPromise = getBlobHash(blob);
    blobHashPromiseCache.set(blob, blobHashPromise);
  }
  return blobHashPromise;
};

const useBlobHash = (blob: Blob) => {
  const blobHashPromise = useMemo(() => getBlobHashPromise(blob), [blob]);
  const blobHash = use(blobHashPromise);
  return blobHash;
};

export { useBlobHash };
