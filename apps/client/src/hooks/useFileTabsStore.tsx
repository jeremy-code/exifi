import { createContext, use, useState } from "react";

import { create, useStore } from "zustand";

type FileTabsState = {
  files: (File | null)[];
  activeFileIndex: number;
  removeFile: (index: number) => void;
  updateFile: (file: File, index: number) => void;
  createNewTab: () => void;
  setActiveFileIndex: (index: number) => void;
};

const createFileTabsStore = () =>
  create<FileTabsState>()((set) => ({
    files: [null],
    activeFileIndex: 0,
    removeFile: (index) => {
      set((state) => {
        if (index === 0 && state.files.length === 1) {
          return {
            files: [null],
            activeFileIndex: 0,
          };
        }

        return {
          files: state.files.toSpliced(index, 1),
          activeFileIndex:
            state.activeFileIndex > index ?
              state.activeFileIndex - 1
            : state.activeFileIndex,
        };
      });
    },
    updateFile: (file, index) =>
      set((state) => ({
        files: state.files.with(index, file),
      })),
    createNewTab: () =>
      set((state) => ({
        files: [...state.files, null],
      })),
    setActiveFileIndex: (index) =>
      set(() => ({
        activeFileIndex: index,
      })),
  }));

type FileTabsStoreApi = ReturnType<typeof createFileTabsStore>;

const FileTabsStoreContext = createContext<FileTabsStoreApi | null>(null);

const FileTabsStoreProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [store] = useState(() => createFileTabsStore());
  return <FileTabsStoreContext value={store}>{children}</FileTabsStoreContext>;
};

const useFileTabsStore = <T,>(selector: (state: FileTabsState) => T): T => {
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
  type FileTabsState,
};
