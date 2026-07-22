import { arrayMove } from "@dnd-kit/helpers";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

type FileTab = {
  id: string;
  file: File | null;
};

type FileTabsStoreState = {
  tabs: FileTab[];
  activeTabId: FileTab["id"];
};

type FileTabsStoreActions = {
  removeTab: (id: string) => void;
  updateTab: (fileTab: FileTab) => void;
  createNewTab: (file?: File) => void;
  createNewTabs: (files?: (File | null)[]) => void;
  setActiveTabId: (id: string) => void;
  reorderTabs: (initialIndex: number, index: number) => void;
};

type FileTabsStore = FileTabsStoreState & FileTabsStoreActions;

const createFileTab = (file: File | null): FileTab => ({
  id: uuidv4(),
  file,
});

const initializeFileTabsStore = () => {
  const initialFileTab = createFileTab(null);

  return {
    tabs: [initialFileTab],
    activeTabId: initialFileTab.id,
  };
};

const useFileTabsStore = create<FileTabsStore>()((set) => ({
  ...initializeFileTabsStore(),
  removeTab: (id) => {
    set((state) => {
      const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
      if (tabIndex === -1) {
        console.warn(
          `useFileTabsStore: tried to remove a tab that doesn't exist: ${id}`,
        );
        return {};
      } else if (tabIndex === 0 && state.tabs.length === 1) {
        // Removing the last tab, re-initialize
        return initializeFileTabsStore();
      }

      const newTabs = state.tabs.toSpliced(tabIndex, 1);
      const newActiveTabId =
        state.activeTabId === id
          ? // Active tab was the last tab, removing and setting to previous
            tabIndex === state.tabs.length - 1
            ? newTabs[newTabs.length - 1]?.id
            : newTabs[tabIndex]?.id // Set active tab to whichever tab is next
          : state.activeTabId;

      // This should never happen
      if (newActiveTabId === undefined) {
        throw new Error(
          "useFileTabsStore: somehow, no tabs have remained after removing a tab",
        );
      }

      return { tabs: newTabs, activeTabId: newActiveTabId };
    });
  },
  updateTab: (fileTab) =>
    set((state) => {
      const tabIndex = state.tabs.findIndex((tab) => tab.id === fileTab.id);
      if (tabIndex === -1) {
        console.warn(
          `useFileTabsStore: tried to update a tab that doesn't exist: ${fileTab.id}`,
        );
        return {};
      }

      return { tabs: state.tabs.with(tabIndex, fileTab) };
    }),
  createNewTab: (file) =>
    set((state) => ({
      tabs: [...state.tabs, createFileTab(file ?? null)],
    })),
  createNewTabs: (files) =>
    set((state) => ({
      tabs: [
        ...state.tabs,
        ...(files ?? [null]).map((file) => createFileTab(file)),
      ],
    })),
  setActiveTabId: (id) =>
    set((state) => {
      if (state.tabs.some((tab) => tab.id === id)) {
        return { activeTabId: id };
      }
      console.warn(
        `useFileTabsStore: tried to set an active tab that doesn't exist: ${id}`,
      );
      return {};
    }),
  reorderTabs: (initialIndex, index) =>
    set((state) => {
      const fileTab = state.tabs[initialIndex];

      if (fileTab === undefined) {
        console.warn(
          `useFileTabsStore: tried to reorder a tab that doesn't exist: ${initialIndex}`,
        );
        return {};
      }

      return {
        tabs: arrayMove(state.tabs, initialIndex, index),
      };
    }),
}));

export { useFileTabsStore, type FileTabsStore, type FileTab };
