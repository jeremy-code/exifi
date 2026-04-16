import type { ReactNode, RefObject } from "react";

import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

type SortableListProps = {
  onSortEnd?: (event: { initialIndex: number; index: number }) => void;
  children: ReactNode;
  containerRef?: RefObject<HTMLElement | null>;
};

const SortableList = ({
  onSortEnd,
  children,
  containerRef,
}: SortableListProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return;
    }

    if (isSortable(event.operation.source)) {
      const { initialIndex, index } = event.operation.source;
      // New index doesn't exist (disabled?) or item returned to original position
      if (index === -1 || initialIndex === index) {
        return;
      }
      onSortEnd?.({ initialIndex, index });
    }
  };

  return (
    <DragDropProvider
      modifiers={(defaults) => [
        ...defaults,
        ...(containerRef ?
          [RestrictToElement.configure({ element: () => containerRef.current })]
        : []),
      ]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropProvider>
  );
};

export { SortableList };
