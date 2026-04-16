import { useRef, type ReactNode } from "react";

import { Plus } from "lucide-react";
import { AccessibleIcon } from "radix-ui";
import { useShallow } from "zustand/react/shallow";

import { SortableList } from "#components/dnd/SortableList";
import { useFileTabsStore } from "#hooks/useFileTabsStore";
import { Button } from "@exiftools/ui/components/Button";
import { Tabs, TabsList, type TabsProps } from "@exiftools/ui/components/Tabs";

import { FileTabsContent } from "./FileTabsContent";
import { FileTabsTrigger } from "./FileTabsTrigger";

type FileTabsProps = {
  children?: ReactNode;
} & TabsProps;

const FileTabs = ({ children, ...props }: FileTabsProps) => {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    removeTab,
    createNewTab,
    updateTab,
    reorderTabs,
  } = useFileTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
      activeTabId: state.activeTabId,
      setActiveTabId: state.setActiveTabId,
      removeTab: state.removeTab,
      createNewTab: state.createNewTab,
      updateTab: state.updateTab,
      reorderTabs: state.reorderTabs,
    })),
  );
  const fileTabsListRef = useRef<HTMLDivElement>(null);

  return (
    <SortableList
      containerRef={fileTabsListRef}
      onSortEnd={({ initialIndex, index }) => reorderTabs(initialIndex, index)}
    >
      <Tabs
        {...props}
        value={activeTabId}
        onValueChange={(id) => setActiveTabId(id)}
      >
        <TabsList
          ref={fileTabsListRef}
          fitted
          className="items-center gap-1"
          variant="enclosed"
        >
          {tabs.map((tab, index) => (
            <FileTabsTrigger
              key={tab.id}
              id={tab.id}
              index={index}
              file={tab.file}
              removeTab={() => removeTab(tab.id)}
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
        {tabs.map((tab) => (
          <FileTabsContent
            key={tab.id}
            id={tab.id}
            file={tab.file}
            updateFile={(file) => updateTab(file, tab.id)}
          >
            {children}
          </FileTabsContent>
        ))}
      </Tabs>
    </SortableList>
  );
};

export { FileTabs };
