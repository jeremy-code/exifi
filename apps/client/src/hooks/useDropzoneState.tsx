import { create } from "zustand";

type DropzoneState = {
  acceptedFiles: File[];
  addAcceptedFiles: (acceptedFiles: File[]) => void;
  removeAcceptedFileByIndex: (index: number) => void;
  replaceAcceptedFileByIndex: (index: number, acceptedFile: File) => void;
};

const useDropzoneState = create<DropzoneState>((set) => ({
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

export { useDropzoneState, type DropzoneState };
