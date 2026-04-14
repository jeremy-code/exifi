import { useEffect, useState } from "react";

import { sha256 } from "hash-wasm";

type UseFileHashResult = {
  fileHash: string | null;
  isPending: boolean;
  error: Error | null;
};

// Module-level: persists across renders, shared across all hook instances,
// and WeakMap keys are held by reference so Files are GC'd naturally.
const fileHashCache = new WeakMap<File, string>();

// Intentionally not using @tanstack/react-query for this because File cannot be
// serialized as a query key. Since useEffect (and WeakMaps) compares
// dependencies by reference, the hook will work as expected.
const useFileHash = (file: File | undefined | null): UseFileHashResult => {
  const [fileHashState, setFileHashState] = useState<UseFileHashResult>(() => {
    if (!file) {
      return { fileHash: null, isPending: false, error: null };
    }
    const cachedFileHash = fileHashCache.get(file);

    return cachedFileHash !== undefined ?
        { fileHash: cachedFileHash, isPending: false, error: null }
      : { fileHash: null, isPending: true, error: null };
  });

  useEffect(() => {
    if (!file || fileHashCache.has(file)) {
      // cache hit: nothing to do
      return;
    }

    // AbortController is used only to prevent stale state updates,
    // not to cancel the underlying operations
    const abortController = new AbortController();

    const computeHash = async () => {
      setFileHashState({ fileHash: null, isPending: true, error: null });
      try {
        const fileInBytes = await file.bytes();
        const fileHash = await sha256(fileInBytes);
        if (abortController.signal.aborted) {
          return;
        }
        fileHashCache.set(file, fileHash);
        setFileHashState({ fileHash, isPending: false, error: null });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        setFileHashState({
          fileHash: null,
          isPending: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    };

    void computeHash();
    return () => abortController.abort();
  }, [file]);

  return fileHashState;
};

export { useFileHash };
