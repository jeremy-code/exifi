import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useDisposeQueryCache } from "./useDisposeQueryCache";

const createMockDisposable = () =>
  ({ [Symbol.dispose]: vi.fn<() => void>() }) satisfies Disposable;

describe("useDisposeQueryCache", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  test("disposes a disposable when a query is removed", async () => {
    const disposable = createMockDisposable();

    await renderHook((initialProps) => useDisposeQueryCache(initialProps!), {
      initialProps: queryClient,
    });

    queryClient.setQueryData(["test"], disposable);

    const query = queryClient.getQueryCache().find({ queryKey: ["test"] });

    expect(query).toBeDefined();

    queryClient.getQueryCache().remove(query!);

    expect(disposable[Symbol.dispose]).toHaveBeenCalledTimes(1);
  });

  test("does not dispose when the same disposable instance is set again", async () => {
    const disposable = createMockDisposable();

    await renderHook((initialProps) => useDisposeQueryCache(initialProps!), {
      initialProps: queryClient,
    });

    queryClient.setQueryData(["test"], disposable);
    queryClient.setQueryData(["test"], disposable);

    expect(disposable[Symbol.dispose]).not.toHaveBeenCalled();
  });

  test("ignores non-disposable query data", async () => {
    await renderHook((initialProps) => useDisposeQueryCache(initialProps!), {
      initialProps: queryClient,
    });

    queryClient.setQueryData(["test"], { hello: "world" });

    const query = queryClient.getQueryCache().find({ queryKey: ["test"] });

    expect(() => queryClient.getQueryCache().remove(query!)).not.toThrow();
  });

  test("disposes multiple query disposables independently", async () => {
    const disposable1 = createMockDisposable();
    const disposable2 = createMockDisposable();

    await renderHook((initialProps) => useDisposeQueryCache(initialProps!), {
      initialProps: queryClient,
    });

    queryClient.setQueryData(["query-1"], disposable1);
    queryClient.setQueryData(["query-2"], disposable2);

    const cache = queryClient.getQueryCache();

    cache.remove(cache.find({ queryKey: ["query-1"] })!);

    expect(disposable1[Symbol.dispose]).toHaveBeenCalledTimes(1);
    expect(disposable2[Symbol.dispose]).not.toHaveBeenCalled();

    cache.remove(cache.find({ queryKey: ["query-2"] })!);

    expect(disposable2[Symbol.dispose]).toHaveBeenCalledTimes(1);
  });

  test("logs an error if disposal throws", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const disposable: Disposable = {
      [Symbol.dispose]: vi.fn<() => void>(() => {
        throw new Error("dispose failed");
      }),
    };

    await renderHook((initialProps) => useDisposeQueryCache(initialProps!), {
      initialProps: queryClient,
    });

    queryClient.setQueryData(["test"], disposable);

    const query = queryClient.getQueryCache().find({ queryKey: ["test"] });

    queryClient.getQueryCache().remove(query!);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "useDisposeQueryCache: an error occurred while disposing",
      query?.queryHash,
      expect.any(Error),
    );
  });

  test("unsubscribes from query cache updates on unmount", async () => {
    const queryCache = queryClient.getQueryCache();

    const originalSubscribe = queryCache.subscribe.bind(queryCache);
    const unsubscribeSpy = vi.fn<() => void>();

    vi.spyOn(queryCache, "subscribe").mockImplementation((listener) => {
      const unsubscribe = originalSubscribe(listener);

      return () => {
        unsubscribeSpy();
        unsubscribe();
      };
    });

    const { unmount } = await renderHook(
      (initialProps) => useDisposeQueryCache(initialProps!),
      { initialProps: queryClient },
    );

    await unmount();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});
