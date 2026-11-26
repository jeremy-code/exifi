import type { ReactNode, RefObject } from "react";

import { Accessibility } from "@dnd-kit/dom";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import { m } from "#paraglide/messages";

type SortableListProps = {
  onSortEnd?: (event: { initialIndex: number; index: number }) => void;
  children: ReactNode;
  containerRef?: RefObject<Element | null>;
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
        ...(containerRef
          ? [RestrictToElement.configure({ element: containerRef.current })]
          : []),
      ]}
      plugins={(defaults) => [
        ...defaults.filter((plugin) => plugin !== Accessibility),
        Accessibility.configure({
          screenReaderInstructions: { draggable: m.editor_dnd_instructions() },
          announcements: {
            dragstart: ({ operation: { source } }: DragStartEvent) =>
              source ? m.editor_dnd_picked_up({ id: source.id }) : undefined,
            dragover: ({ operation: { source, target } }: DragOverEvent) => {
              if (!source || source.id === target?.id) {
                return undefined;
              }
              return target
                ? m.editor_dnd_moved_over({
                    id: source.id,
                    targetId: target.id,
                  })
                : m.editor_dnd_no_longer_over({ id: source.id });
            },
            dragend: ({
              operation: { source, target },
              canceled,
            }: DragEndEvent) => {
              if (!source) {
                return undefined;
              }
              if (canceled) {
                return m.editor_dnd_cancelled({ id: source.id });
              }
              return target
                ? m.editor_dnd_dropped_over({
                    id: source.id,
                    targetId: target.id,
                  })
                : m.editor_dnd_dropped({ id: source.id });
            },
          },
        }),
      ]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropProvider>
  );
};

export { SortableList };
