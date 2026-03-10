import { create } from "zustand";

type DropzoneState = {
  acceptedFiles: File[];
  addAcceptedFiles: (acceptedFiles: File[]) => void;
  removeAcceptedFileByIndex: (index: number) => void;
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
}));

export { useDropzoneState, type DropzoneState };
