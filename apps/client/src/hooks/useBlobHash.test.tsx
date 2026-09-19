import { describe, test, expect, vi, afterEach } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useBlobHash } from "./useBlobHash";

const SHA256 = {
  empty: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  hello: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  world: "486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7",
  foo: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
} as const;

const renderUseBlobHash = (blob: Blob) =>
  renderHook((initialProps) => useBlobHash(initialProps!), {
    initialProps: blob,
  });

describe("useBlobHash", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.for([
    ["empty", new Blob([]), SHA256.empty],
    ["world", new Blob(["world"]), SHA256.world],
    ["foo", new Blob(["foo"]), SHA256.foo],
  ] as const)(
    "returns the correct SHA-256 digest for a blob with content %s",
    async ([, blob, expectedHash]) => {
      const { result } = await renderUseBlobHash(blob);
      // result.current may be null while suspending (more noticable in CI)
      await expect.poll(() => result.current).toBe(expectedHash);
    },
  );

  test("produces distinct hashes for files with different content", async () => {
    const file1 = new Blob(["hello"]);
    const file2 = new Blob(["world"]);
    const { rerender, result } = await renderUseBlobHash(file1);

    await expect.poll(() => result.current).toBe(SHA256.hello);
    await rerender(file2);
    await expect.poll(() => result.current).toBe(SHA256.world);
  });

  test("produces the same hash for two different Blob instances", async () => {
    const blob1 = new Blob(["foo"]);
    const blob2 = new Blob(["foo"]);
    const { rerender, result } = await renderUseBlobHash(blob1);

    await expect.poll(() => result.current).toBe(SHA256.foo);
    await rerender(blob2);
    await expect.poll(() => result.current).toBe(SHA256.foo);
  });

  test("calls blob.arrayBuffer() once for the same Blob reference", async () => {
    const blob = new Blob(["cached"]);
    const arrayBufferSpy = vi.spyOn(blob, "arrayBuffer");

    const { rerender } = await renderUseBlobHash(blob);

    expect(arrayBufferSpy).toHaveBeenCalledOnce();
    await rerender(blob);
    expect(arrayBufferSpy).toHaveBeenCalledOnce();
  });

  test("calls arrayBuffer() independently for two different Blob instances", async () => {
    const blob1 = new Blob(["data"]);
    const blob2 = new Blob(["data"]);
    const spy1 = vi.spyOn(blob1, "arrayBuffer");
    const spy2 = vi.spyOn(blob2, "arrayBuffer");

    const { rerender } = await renderUseBlobHash(blob1);

    expect(spy1).toHaveBeenCalledOnce();
    await rerender(blob2);
    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
  });
});
