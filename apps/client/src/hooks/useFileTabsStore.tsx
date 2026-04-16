import { createContext, use, useState } from "react";

import { arrayMove } from "@dnd-kit/helpers";
import { create, useStore } from "zustand";

type FileTab = {
  id: string;
  file: File | null;
};

type FileTabsStoreState = {
  tabs: FileTab[];
  activeTabId: string;
};

type FileTabsStoreActions = {
  removeTab: (id: string) => void;
  updateTab: (file: File, id: string) => void;
  createNewTab: () => void;
  setActiveTabId: (id: string) => void;
  reorderTabs: (initialIndex: number, index: number) => void;
};

type FileTabsStore = FileTabsStoreState & FileTabsStoreActions;

const createFileTab = (file: File | null): FileTab => ({
  id: crypto.randomUUID(),
  file,
});

const initializeFileTabsStore = () => {
  const initialFileTab = createFileTab(null);

  return { tabs: [initialFileTab], activeTabId: initialFileTab.id };
};

const createFileTabsStore = () =>
  create<FileTabsStore>()((set) => ({
    ...initializeFileTabsStore(),
    removeTab: (id) => {
      set((state) => {
        const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
        if (tabIndex === -1) {
          return {};
        } else if (tabIndex === 0 && state.tabs.length === 1) {
          return initializeFileTabsStore();
        }

        const newTabs = state.tabs.toSpliced(tabIndex, 1);
        const newActiveTabId =
          state.activeTabId === id ?
            (newTabs[Math.max(0, tabIndex - 1)]?.id ?? newTabs[0]?.id)
          : state.activeTabId;

        if (newActiveTabId === undefined) {
          throw new Error(
            "Somehow, no tabs have remained after removing a tab",
          );
        }

        return { tabs: newTabs, activeTabId: newActiveTabId };
      });
    },
    updateTab: (file, id) =>
      set((state) => {
        const tabIndex = state.tabs.findIndex((tab) => tab.id === id);

        return tabIndex !== -1 ?
            { tabs: state.tabs.with(tabIndex, { file, id }) }
          : {};
      }),
    createNewTab: () =>
      set((state) => ({
        tabs: [...state.tabs, createFileTab(null)],
      })),
    setActiveTabId: (id) => set(() => ({ activeTabId: id })),
    reorderTabs: (initialIndex, index) =>
      set((state) => ({ tabs: arrayMove(state.tabs, initialIndex, index) })),
  }));

type FileTabsStoreApi = ReturnType<typeof createFileTabsStore>;

const FileTabsStoreContext = createContext<FileTabsStoreApi | null>(null);

const FileTabsStoreProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [store] = useState(() => createFileTabsStore());

  return <FileTabsStoreContext value={store}>{children}</FileTabsStoreContext>;
};

const useFileTabsStore = <T,>(selector: (state: FileTabsStore) => T): T => {
  const fileTabsStore = use(FileTabsStoreContext);

  if (fileTabsStore === null) {
    throw new Error("Missing FileTabsStoreContext in the tree");
  }

  return useStore(fileTabsStore, selector);
};

export {
  createFileTabsStore,
  FileTabsStoreProvider,
  useFileTabsStore,
  type FileTabsStore,
  type FileTab,
};
