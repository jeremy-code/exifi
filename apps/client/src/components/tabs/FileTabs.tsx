import { useRef, type ReactNode } from "react";

import { Plus } from "lucide-react";
import { AccessibleIcon } from "radix-ui";
import { useShallow } from "zustand/react/shallow";

import { SortableList } from "#components/dnd/SortableList";
import { useFileTabsStore } from "#hooks/useFileTabsStore";
import { Button } from "@exifi/ui/components/Button";
import { ScrollArea } from "@exifi/ui/components/ScrollArea";
import { Tabs, TabsList, type TabsProps } from "@exifi/ui/components/Tabs";

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
        {/* Offset by height of Navbar */}
        <div className="sticky top-[--spacing(19.75)] z-50 order-1 container pt-3">
          <ScrollArea className="rounded-md border bg-muted shadow">
            <TabsList
              ref={fileTabsListRef}
              fitted
              className="gap-1"
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
              <div className="sticky top-0 right-1">
                <Button
                  className="text-muted-foreground"
                  size="icon"
                  variant="muted"
                  onClick={() => createNewTab()}
                >
                  <AccessibleIcon.Root label="New tab">
                    <Plus size={16} />
                  </AccessibleIcon.Root>
                </Button>
              </div>
            </TabsList>
          </ScrollArea>
        </div>
        {tabs.map((tab) => (
          <FileTabsContent
            className="container pb-8"
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
