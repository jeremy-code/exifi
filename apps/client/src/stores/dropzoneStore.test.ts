import { describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useDropzoneStore } from "./dropzoneStore";

vi.mock("zustand");

describe("useDropzoneStore", () => {
  test("initializes with an empty acceptedFiles array", async () => {
    const { result } = await renderHook(() => useDropzoneStore());

    expect(result.current.acceptedFiles).toEqual([]);
  });

  test("adds accepted files", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const expectedAcceptedFiles = [
      new File(["test"], "file1.jpg"),
      new File(["test"], "file2.jpg"),
    ];

    await act(() => {
      result.current.addAcceptedFiles(expectedAcceptedFiles);
    });

    expect(result.current.acceptedFiles).toEqual(expectedAcceptedFiles);
  });

  test("appends accepted files instead of replacing existing files", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const file1 = new File(["test"], "file1.jpg");
    const file2 = new File(["test"], "file2.jpg");

    await act(() => {
      result.current.addAcceptedFiles([file1]);
      result.current.addAcceptedFiles([file2]);
    });

    expect(result.current.acceptedFiles).toEqual([file1, file2]);
  });

  test("removes an accepted file by index", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const file1 = new File(["test"], "file1.jpg");
    const file2 = new File(["test"], "file2.jpg");
    const file3 = new File(["test"], "file3.jpg");

    await act(() => {
      result.current.addAcceptedFiles([file1, file2, file3]);
    });

    await act(() => {
      result.current.removeAcceptedFileByIndex(1);
    });

    expect(result.current.acceptedFiles).toEqual([file1, file3]);
  });

  test("warns and does nothing when removing a non-existent file", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const consolewWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const expectedAcceptedFiles = [new File(["test"], "file1.jpg")];

    await act(() => {
      result.current.addAcceptedFiles(expectedAcceptedFiles);
      result.current.removeAcceptedFileByIndex(99);
    });

    expect(consolewWarnSpy).toHaveBeenCalledExactlyOnceWith(
      "useDropzoneStore: tried to remove an accepted file that doesn't exist: 99",
    );
    expect(result.current.acceptedFiles).toEqual(expectedAcceptedFiles);
  });

  test("replaces an accepted file by index", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const file1 = new File(["test"], "file1.jpg");
    const file2 = new File(["test"], "file2.jpg");
    const replacement = new File(["test"], "replacement.jpg");

    await act(() => {
      result.current.addAcceptedFiles([file1, file2]);
      result.current.replaceAcceptedFileByIndex(1, replacement);
    });

    expect(result.current.acceptedFiles).toEqual([file1, replacement]);
  });

  test("warns and does nothing when replacing a non-existent file", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const expectedAcceptedFiles = [new File(["test"], "file.jpg")];
    const replacement = new File(["test"], "replacement.jpg");

    await act(() => {
      result.current.addAcceptedFiles(expectedAcceptedFiles);
      result.current.replaceAcceptedFileByIndex(99, replacement);
    });

    expect(consoleWarnSpy).toHaveBeenCalledExactlyOnceWith(
      "useDropzoneStore: tried to replace an accepted file that doesn't exist: 99",
    );
    expect(result.current.acceptedFiles).toEqual(expectedAcceptedFiles);
  });

  test("resets accepted files", async () => {
    const { result, act } = await renderHook(() => useDropzoneStore());

    const file1 = new File(["test"], "file1.jpg");
    const file2 = new File(["test"], "file2.jpg");

    await act(() => {
      result.current.addAcceptedFiles([file1, file2]);
    });

    expect(result.current.acceptedFiles).toEqual([file1, file2]);

    await act(() => {
      result.current.resetAcceptedFiles();
    });

    expect(result.current.acceptedFiles).toEqual([]);
  });
});
