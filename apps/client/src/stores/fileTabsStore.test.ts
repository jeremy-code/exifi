import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useFileTabsStore } from "./fileTabsStore";

const { mockedUuidv4 } = vi.hoisted(() => ({
  mockedUuidv4: vi.fn<() => string>(() => "uuid-0"),
}));

vi.mock("uuid", () => ({
  v4: mockedUuidv4,
}));
vi.mock("zustand");

describe("useFileTabsStore", () => {
  beforeEach(() => {
    let uuidCounter = 1;
    mockedUuidv4.mockImplementation(() => "uuid-" + uuidCounter++);
  });

  test("initializes with one tab", async () => {
    const { result } = await renderHook(() => useFileTabsStore());

    expect(result.current.tabs).toStrictEqual([{ id: "uuid-0", file: null }]);
    expect(result.current.activeTabId).toBe("uuid-0");
  });

  test("initializes with one tab in getState", () => {
    expect(useFileTabsStore.getState().tabs).toStrictEqual([
      { id: "uuid-0", file: null },
    ]);
    expect(useFileTabsStore.getState().activeTabId).toBe("uuid-0");
  });

  describe("createNewTab", () => {
    test("creates a new tab without a file", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => result.current.createNewTab());

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-1", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });

    test("creates a new tab with a file", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());
      const file = new File(["hello"], "test.txt", {
        type: "text/plain",
      });

      await act(() => result.current.createNewTab(file));

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-1", file },
      ]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });
  });

  describe("createNewTabs", () => {
    test("creates multiple tabs", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      const file1 = new File(["1"], "one.txt");
      const file2 = new File(["2"], "two.txt");

      await act(() => result.current.createNewTabs([file1, file2, null]));

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-1", file: file1 },
        { id: "uuid-2", file: file2 },
        { id: "uuid-3", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });

    test("creates one null tab without args", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => result.current.createNewTabs());

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-1", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });
  });

  describe("updateTab", () => {
    test("updates a tab", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      const file = new File(["updated"], "updated.txt");

      await act(() =>
        result.current.updateTab({
          id: "uuid-0",
          file,
        }),
      );

      expect(result.current.tabs).toStrictEqual([{ id: "uuid-0", file }]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });

    test("does nothing when updating a nonexistent tab", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { result, act } = await renderHook(() => useFileTabsStore());

      const previousTabs = result.current.tabs;
      const previousActiveTabId = result.current.activeTabId;

      await act(() =>
        result.current.updateTab({ id: "does-not-exist", file: null }),
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "useFileTabsStore: tried to update a tab that doesn't exist: does-not-exist",
      );
      expect(result.current.tabs).toStrictEqual(previousTabs);
      expect(result.current.activeTabId).toBe(previousActiveTabId);
    });
  });

  describe("removeTab", () => {
    test("removes a tab", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => {
        result.current.createNewTabs([null, null]);
        result.current.removeTab("uuid-1");
      });

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-2", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });

    test("updates active tab when removing the active tab", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => {
        result.current.createNewTabs([null, null]);
        result.current.setActiveTabId("uuid-1");
        result.current.removeTab("uuid-1");
      });

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-2", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-2");
    });

    test("updates active tab when removing a tab that is both last and active", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => {
        result.current.createNewTabs([null, null]);
        result.current.setActiveTabId("uuid-1");
        result.current.removeTab("uuid-2");
      });

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-1", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-1");
    });

    test("resets store when removing the last remaining tab", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => result.current.removeTab(result.current.tabs[0]!.id));

      expect(result.current.tabs).toStrictEqual([{ id: "uuid-1", file: null }]);
      expect(result.current.activeTabId).toBe("uuid-1");
    });

    test("does nothing when removing a nonexistent tab", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { result, act } = await renderHook(() => useFileTabsStore());

      const previousTabs = result.current.tabs;
      const previousActiveTabId = result.current.activeTabId;

      await act(() => result.current.removeTab("missing"));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "useFileTabsStore: tried to remove a tab that doesn't exist: missing",
      );
      expect(result.current.tabs).toStrictEqual(previousTabs);
      expect(result.current.activeTabId).toBe(previousActiveTabId);
    });
  });

  describe("setActiveTabId", () => {
    test("sets active tab id", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => {
        result.current.createNewTab();
        result.current.setActiveTabId("uuid-1");
      });

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-0", file: null },
        { id: "uuid-1", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-1");
    });

    test("does nothing when setting a nonexistent tab id", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { result, act } = await renderHook(() => useFileTabsStore());

      const previousTabs = result.current.tabs;
      const previousActiveTabId = result.current.activeTabId;

      await act(() => {
        result.current.setActiveTabId("missing");
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "useFileTabsStore: tried to set an active tab that doesn't exist: missing",
      );
      expect(result.current.tabs).toStrictEqual(previousTabs);
      expect(result.current.activeTabId).toBe(previousActiveTabId);
    });
  });

  describe("reorderTabs", () => {
    test("reorders tabs", async () => {
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => {
        result.current.createNewTabs([null, null, null]);
        result.current.reorderTabs(0, 2);
      });

      expect(result.current.tabs).toStrictEqual([
        { id: "uuid-1", file: null },
        { id: "uuid-2", file: null },
        { id: "uuid-0", file: null },
        { id: "uuid-3", file: null },
      ]);
      expect(result.current.activeTabId).toBe("uuid-0");
    });

    test("does nothing when reordering nonexistent tab", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { result, act } = await renderHook(() => useFileTabsStore());

      await act(() => {
        result.current.createNewTabs([null, null, null]);
      });

      const previousTabs = result.current.tabs;
      const previousActiveTabId = result.current.activeTabId;

      await act(() => {
        result.current.reorderTabs(999, 0);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "useFileTabsStore: tried to reorder a tab that doesn't exist: 999",
      );
      expect(result.current.tabs).toStrictEqual(previousTabs);
      expect(result.current.activeTabId).toBe(previousActiveTabId);
    });
  });
});
