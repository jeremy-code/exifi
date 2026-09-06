import {
  createContext,
  use,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type FileContextType = {
  file: File;
  setFile: Dispatch<SetStateAction<File>>;
};

const FileContext = createContext<FileContextType | null>(null);

type FileProviderProps = {
  initialFile: File | (() => File);
} & Readonly<{ children: React.ReactNode }>;

const FileProvider = ({ initialFile, children }: FileProviderProps) => {
  const [file, setFile] = useState(initialFile);

  return <FileContext value={{ file, setFile }}>{children}</FileContext>;
};

const useFile = (): FileContextType => {
  const fileContext = use(FileContext);

  if (fileContext === null) {
    throw new Error("Missing FileProvider in the tree");
  }

  return fileContext;
};

export {
  FileProvider,
  type FileProviderProps,
  useFile,
  type FileContextType,
  FileContext,
};
