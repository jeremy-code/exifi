import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns the initial value immediately", async () => {
    const { result } = await renderHook(
      (initialProps) => useDebouncedValue(initialProps),
      { initialProps: "hello" },
    );
    expect(result.current).toBe("hello");
  });

  test("updates the value after the default delay", async () => {
    const { result, rerender, act } = await renderHook(
      (initialProps) => useDebouncedValue(initialProps),
      { initialProps: "hello" },
    );
    expect(result.current).toBe("hello");

    await rerender("world");
    expect(result.current).toBe("hello");

    await act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("hello");

    await act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("world");
  });

  test("uses a custom delay", async () => {
    const { result, rerender, act } = await renderHook(
      (initialProps) =>
        useDebouncedValue(initialProps?.value, initialProps?.delay),
      { initialProps: { value: "hello", delay: 1000 } },
    );

    await rerender({ value: "world", delay: 1000 });
    await act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current).toBe("hello");

    await act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("world");
  });

  test("cancels the previous timeout when value changes rapidly", async () => {
    const { result, rerender, act } = await renderHook(
      (value) => useDebouncedValue(value),
      { initialProps: "a" },
    );

    await rerender("b");
    await act(() => {
      vi.advanceTimersByTime(300);
    });

    await rerender("c");
    // Old timeout should have been cleared (i.e. result.current should NOT be "b")
    await act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("a");

    await act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("c");
  });

  test("restarts debounce when delay changes", async () => {
    const { result, rerender, act } = await renderHook(
      (initialProps) =>
        useDebouncedValue(initialProps?.value, initialProps?.delay),
      { initialProps: { value: "a", delay: 500 } },
    );

    await rerender({ value: "b", delay: 1000 });
    await act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("a");

    await act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("b");
  });

  test("cleans up timeout on unmount", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { rerender, unmount } = await renderHook(
      (value) => useDebouncedValue(value),
      { initialProps: "a" },
    );

    await rerender("b");

    await unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
