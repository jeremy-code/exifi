import type { ComponentPropsWithRef } from "react";

import { useSortable } from "@dnd-kit/react/sortable";
import { X } from "lucide-react";
import { AccessibleIcon } from "radix-ui";
import { cn } from "tailwind-variants";

import { Button } from "@exiftools/ui/components/Button";
import { TabsTrigger } from "@exiftools/ui/components/Tabs";

type FileTabsTriggerProps = {
  id: string;
  index: number;
  file: File | null;
  removeTab: () => void;
} & Omit<ComponentPropsWithRef<typeof TabsTrigger>, "value">;

const FileTabsTrigger = ({
  className,
  id,
  index,
  file,
  removeTab,
  ...props
}: FileTabsTriggerProps) => {
  const { ref, isDragSource } = useSortable({ id, index });

  return (
    <TabsTrigger
      ref={ref}
      data-dragging={isDragSource}
      className={cn(
        "flex items-center pr-10! transition-colors data-[dragging=true]:opacity-50",
        "data-[state=inactive]:hover:bg-gray-100",
        "dark:data-[state=inactive]:hover:bg-gray-700/50",
        className,
      )}
      value={id}
      {...props}
    >
      <span className="line-clamp-1">
        {file !== null ?
          file.name !== "" ?
            file.name
          : "Unnamed File"
        : "New Tab"}
      </span>
      <Button
        className="absolute right-1 group-data-[state=inactive]/tabs-trigger:hover:bg-border"
        variant="ghost"
        size="icon-xs"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={() => removeTab()}
      >
        <AccessibleIcon.Root label="Close tab">
          <X size={16} />
        </AccessibleIcon.Root>
      </Button>
    </TabsTrigger>
  );
};

export { FileTabsTrigger, type FileTabsTriggerProps };
