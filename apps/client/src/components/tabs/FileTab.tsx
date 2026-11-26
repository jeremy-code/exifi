import { useSortable } from "@dnd-kit/react/sortable";
import { X } from "lucide-react";
import { cn } from "tailwind-variants";

import { m } from "#paraglide/messages";
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
      ref={(element) => {
        // React Aria's `Tab` doesn't forward `aria-roledescription` to the DOM,
        // and dnd-kit only applies its English "draggable" default when the
        // attribute is missing
        element?.setAttribute(
          "aria-roledescription",
          m.viewer_tab_draggable_role(),
        );
        ref(element);
      }}
      id={id}
      data-dragging={isDragSource}
      aria-roledescription={m.viewer_tab_draggable_role()}
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
            : m.files_tab_unnamed_file()
          : m.files_tab_new_tab()}
      </span>
      <Button
        className={cn("absolute right-1", [
          "hover:bg-gray-200 pressed:bg-gray-300",
          "dark:hover:bg-gray-600 dark:pressed:bg-gray-500",
        ])}
        variant="ghost"
        size="icon-xs"
        onPress={() => removeTab()}
        aria-label={m.files_tab_close()}
      >
        <X className="size-4" />
      </Button>
    </Tab>
  );
};

export { FileTab, type FileTabProps };
