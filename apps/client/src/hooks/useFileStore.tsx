import {
  createContext,
  use,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type FileStore = {
  file: File;
  setFile: Dispatch<SetStateAction<File>>;
};

const FileStoreContext = createContext<FileStore | null>(null);

type FileStoreProviderProps = {
  initialFile: File | (() => File);
  onFileChange: (file: File) => void;
} & Readonly<{ children: React.ReactNode }>;

const FileStoreProvider = ({
  initialFile,
  onFileChange,
  children,
}: FileStoreProviderProps) => {
  const [file, setFile] = useState(initialFile);

  useEffect(() => {
    if (file !== initialFile) {
      onFileChange(file);
    }
  }, [onFileChange, initialFile, file]);

  return (
    <FileStoreContext value={{ file, setFile }}>{children}</FileStoreContext>
  );
};

const useFileStore = (): FileStore => {
  const fileStore = use(FileStoreContext);

  if (fileStore === null) {
    throw new Error("Missing FileStoreProvider in the tree");
  }

  return fileStore;
};

export { FileStoreProvider, useFileStore, type FileStore };
