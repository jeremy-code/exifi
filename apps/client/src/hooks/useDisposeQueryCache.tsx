import { useEffect } from "react";

import type { QueryClient } from "@tanstack/react-query";

import { isDisposable } from "@exifi/utils/isDisposable";

const hashedDisposables = new Map<string, Disposable>();

const addDisposable = (queryHash: string, newValue: unknown) => {
  const prevValue = hashedDisposables.get(queryHash);
  // Already exists
  if (prevValue === newValue) {
    return;
  }

  if (isDisposable(newValue)) {
    // A different Disposable has been stored under that queryHash, replace and
    // dispose it
    if (prevValue !== undefined) {
      removeDisposable(queryHash);
    }
    hashedDisposables.set(queryHash, newValue);
  }
};

const removeDisposable = (queryHash: string) => {
  const prevValue = hashedDisposables.get(queryHash);

  if (isDisposable(prevValue)) {
    hashedDisposables.delete(queryHash);
    try {
      prevValue[Symbol.dispose]();
    } catch (error) {
      console.error(
        "useDisposeQueryCache: an error occurred while disposing",
        queryHash,
        error,
      );
    }
  }
};

const useDisposeQueryCache = (queryClient: QueryClient) => {
  useEffect(() => {
    const queryCache = queryClient.getQueryCache();

    const unsubscribe = queryCache.subscribe((event) => {
      if (event.type == "added" || event.type == "updated") {
        const value = queryCache.get(event.query.queryHash)?.state.data;
        addDisposable(event.query.queryHash, value);
      } else if (event.type == "removed") {
        removeDisposable(event.query.queryHash);
      }
    });

    return unsubscribe;
  }, [queryClient]);

  return;
};

export { useDisposeQueryCache };
