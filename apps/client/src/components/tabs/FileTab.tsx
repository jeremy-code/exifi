import { useSortable } from "@dnd-kit/react/sortable";
import { X } from "lucide-react";

import { Button } from "@exifi/ui/components/Button";
import { Tab, type TabProps } from "@exifi/ui/components/Tabs";
import { composeTailwindRenderProps } from "@exifi/ui/utils/composeTailwindRenderProps";

type FileTabProps = {
  id: string;
  index: number;
  file: File | null;
  removeTab: () => void;
} & TabProps;

const FileTab = ({
  className,
  id,
  index,
  file,
  removeTab,
  ...props
}: FileTabProps) => {
  const { ref, isDragSource } = useSortable({ id, index });

  return (
    <Tab
      ref={ref}
      id={id}
      data-dragging={isDragSource}
      className={composeTailwindRenderProps(className, [
        "group/tabs-trigger",
        "flex min-w-50 items-center pr-10! transition-colors data-[dragging=true]:opacity-50",
        "not-selected:hover:bg-gray-50/80",
        "dark:not-selected:hover:bg-gray-700/50",
      ])}
      {...props}
    >
      <span className="line-clamp-1">
        {file !== null
          ? file.name !== ""
            ? file.name
            : "Unnamed File"
          : "New Tab"}
      </span>
      <Button
        className="absolute right-1 group-not-selected/tabs-trigger:hover:bg-border"
        variant="ghost"
        size="icon-xs"
        onPress={() => removeTab()}
        aria-label="Close tab"
      >
        <X size={16} />
      </Button>
    </Tab>
  );
};

export { FileTab, type FileTabProps };
