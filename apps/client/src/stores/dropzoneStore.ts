import { create } from "zustand";

type DropzoneStoreState = {
  acceptedFiles: File[];
};

type DropzoneStoreActions = {
  addAcceptedFiles: (acceptedFiles: File[]) => void;
  removeAcceptedFileByIndex: (index: number) => void;
  replaceAcceptedFileByIndex: (index: number, acceptedFile: File) => void;
  resetAcceptedFiles: () => void;
};

type DropzoneStore = DropzoneStoreState & DropzoneStoreActions;

const useDropzoneStore = create<DropzoneStore>((set, _, store) => ({
  acceptedFiles: [],
  addAcceptedFiles: (acceptedFiles) =>
    set((state) => ({
      acceptedFiles: [...state.acceptedFiles, ...acceptedFiles],
    })),
  removeAcceptedFileByIndex: (index) =>
    set((state) => {
      if (index >= state.acceptedFiles.length) {
        console.warn(
          `useDropzoneStore: tried to remove an accepted file that doesn't exist: ${index}`,
        );
        return {};
      }
      return {
        acceptedFiles: state.acceptedFiles.toSpliced(index, 1),
      };
    }),
  replaceAcceptedFileByIndex: (index, acceptedFile) =>
    set((state) => {
      if (index >= state.acceptedFiles.length) {
        console.warn(
          `useDropzoneStore: tried to replace an accepted file that doesn't exist: ${index}`,
        );
        return {};
      }

      return {
        acceptedFiles: state.acceptedFiles.with(index, acceptedFile),
      };
    }),
  resetAcceptedFiles: () => set(store.getInitialState()),
}));

export { useDropzoneStore, type DropzoneStore };
