import { describe, test, expect, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useObjectUrl } from "./useObjectUrl";

const renderUseObjectUrl = (obj: Blob | MediaSource) =>
  renderHook((initialProps) => useObjectUrl(initialProps!), {
    initialProps: obj,
  });

describe("useObjectUrl", () => {
  test("should create and revoke object URL only once after initial render", async () => {
    const blob = new Blob(["Hello, world!"], { type: "text/plain" });

    using createObjectUrlSpy = vi.spyOn(URL, "createObjectURL");
    using revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL");
    const { result, unmount } = await renderUseObjectUrl(blob);
    expect(createObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(blob);
    expect(revokeObjectUrlSpy).not.toHaveBeenCalled();
    const objectUrl = result.current;
    expect(objectUrl).toMatch(/^blob:/);

    await unmount();

    expect(createObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(blob);
    expect(revokeObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(objectUrl);
  });

  test("should create and revoke object URLs correctly", async () => {
    const blob1 = new Blob(["Hello, world!"], { type: "text/plain" });
    const blob2 = new Blob(["Goodbye, world!"], { type: "text/plain" });

    using createObjectUrlSpy = vi.spyOn(URL, "createObjectURL");
    using revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL");

    const { rerender, result, unmount } = await renderUseObjectUrl(blob1);
    expect(createObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(blob1);
    expect(revokeObjectUrlSpy).not.toHaveBeenCalled();
    const objectUrl1 = result.current;
    expect(objectUrl1).toMatch(/^blob:/);

    await rerender(blob2);
    expect(createObjectUrlSpy).toHaveBeenNthCalledWith(2, blob2);
    expect(createObjectUrlSpy).toHaveBeenCalledTimes(2);
    expect(revokeObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(objectUrl1);
    const objectUrl2 = result.current;
    expect(objectUrl2).toMatch(/^blob:/);
    expect(objectUrl2).not.toBe(objectUrl1);

    await unmount();

    expect(createObjectUrlSpy).toHaveBeenCalledTimes(2);
    expect(revokeObjectUrlSpy).toHaveBeenNthCalledWith(2, objectUrl2);
    expect(revokeObjectUrlSpy).toHaveBeenCalledTimes(2);
  });

  test("should reuse object URL for the same blob", async () => {
    const blob = new Blob(["Hello, world!"], { type: "text/plain" });

    using createObjectUrlSpy = vi.spyOn(URL, "createObjectURL");
    using revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL");

    const { rerender, result, unmount } = await renderUseObjectUrl(blob);
    expect(createObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(blob);
    expect(revokeObjectUrlSpy).not.toHaveBeenCalled();
    const objectUrl = result.current;
    expect(objectUrl).toMatch(/^blob:/);

    await rerender(blob);

    expect(result.current).toBe(objectUrl);
    expect(createObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(blob);
    expect(revokeObjectUrlSpy).not.toHaveBeenCalled();

    await unmount();

    expect(createObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(blob);
    expect(revokeObjectUrlSpy).toHaveBeenCalledExactlyOnceWith(objectUrl);
  });
});
