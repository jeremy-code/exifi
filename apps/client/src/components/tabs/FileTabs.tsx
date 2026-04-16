import { type ReactNode } from "react";

import { Plus } from "lucide-react";
import { AccessibleIcon } from "radix-ui";

import { useFileTabsStore } from "#hooks/useFileTabsStore";
import { Button } from "@exiftools/ui/components/Button";
import { Tabs, TabsList, type TabsProps } from "@exiftools/ui/components/Tabs";

import { FileTabsContent } from "./FileTabsContent";
import { FileTabsTrigger } from "./FileTabsTrigger";

type FileTabsProps = {
  children?: ReactNode;
} & TabsProps;

const FileTabs = ({ children, ...props }: FileTabsProps) => {
  const files = useFileTabsStore((state) => state.files);
  const activeFileIndex = useFileTabsStore((state) => state.activeFileIndex);
  const setActiveFileIndex = useFileTabsStore(
    (state) => state.setActiveFileIndex,
  );
  const removeFile = useFileTabsStore((state) => state.removeFile);
  const createNewTab = useFileTabsStore((state) => state.createNewTab);
  const updateFile = useFileTabsStore((state) => state.updateFile);

  return (
    <Tabs
      {...props}
      value={String(activeFileIndex)}
      onValueChange={(value) => setActiveFileIndex(Number(value))}
    >
      <TabsList fitted className="items-center gap-1" variant="enclosed">
        {files.map((file, index) => (
          <FileTabsTrigger
            key={index}
            index={index}
            file={file}
            removeFile={() => removeFile(index)}
          />
        ))}
        <Button
          className="text-muted-foreground"
          size="icon-sm"
          variant="muted"
          onClick={() => createNewTab()}
        >
          <AccessibleIcon.Root label="New tab">
            <Plus size={16} />
          </AccessibleIcon.Root>
        </Button>
      </TabsList>

      {files.map((file, index) => (
        <FileTabsContent
          key={index}
          index={index}
          file={file}
          updateFile={(file) => updateFile(file, index)}
        >
          {children}
        </FileTabsContent>
      ))}
    </Tabs>
  );
};

export { FileTabs };
