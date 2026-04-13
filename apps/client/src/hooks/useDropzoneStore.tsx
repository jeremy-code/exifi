import { createContext, use, useState, type ReactNode } from "react";

import { create, useStore } from "zustand";

type DropzoneState = {
  acceptedFiles: File[];
  addAcceptedFiles: (acceptedFiles: File[]) => void;
  removeAcceptedFileByIndex: (index: number) => void;
  replaceAcceptedFileByIndex: (index: number, acceptedFile: File) => void;
};

const createDropzoneStore = () =>
  create<DropzoneState>((set) => ({
    acceptedFiles: [],
    addAcceptedFiles: (acceptedFiles) =>
      set((state) => ({
        acceptedFiles: [...state.acceptedFiles, ...acceptedFiles],
      })),
    removeAcceptedFileByIndex: (index) =>
      set((state) => ({
        acceptedFiles: state.acceptedFiles.toSpliced(index, 1),
      })),
    replaceAcceptedFileByIndex: (index, acceptedFile) =>
      set((state) => ({
        acceptedFiles: state.acceptedFiles.with(index, acceptedFile),
      })),
  }));

type DropzoneStoreApi = ReturnType<typeof createDropzoneStore>;

const DropzoneStoreContext = createContext<DropzoneStoreApi | null>(null);

const DropzoneStoreProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [store] = useState(() => createDropzoneStore());
  return <DropzoneStoreContext value={store}>{children}</DropzoneStoreContext>;
};

const useDropzoneStore = <T,>(selector: (state: DropzoneState) => T): T => {
  const dropzoneStore = use(DropzoneStoreContext);

  if (dropzoneStore === null) {
    throw new Error("Missing DropzoneStoreContext in the tree");
  }

  return useStore(dropzoneStore, selector);
};

export { DropzoneStoreProvider, useDropzoneStore, type DropzoneState };
