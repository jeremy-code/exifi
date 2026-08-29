import { describe, expect, test } from "vitest";

import { isDisposable } from "./isDisposable";

describe("isDisposable", () => {
  describe("should return true for disposables", () => {
    test.for([{ [Symbol.dispose]: () => {} }, new DisposableStack()] as const)(
      "should return true for %s",
      (value) => {
        using disposable = value;
        expect(isDisposable(disposable)).toBe(true);
      },
    );
  });

  describe("should return false for non-disposables", () => {
    test.for([
      null,
      undefined,
      0,
      "string",
      true,
      Symbol.iterator,
      {},
      [],
    ] as const)("should return false for %s", (value) => {
      expect(isDisposable(value)).toBe(false);
    });

    test("should return false for disposable with non-function dispose", () => {
      expect(isDisposable({ [Symbol.dispose]: 0 })).toBe(false);
    });

    test("should return false for async disposable", async () => {
      await using asyncDisposable = new AsyncDisposableStack();
      expect(isDisposable(asyncDisposable)).toBe(false);
    });
  });
});
