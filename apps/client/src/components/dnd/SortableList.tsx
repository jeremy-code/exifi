import type { ReactNode, RefObject } from "react";

import { Accessibility } from "@dnd-kit/dom";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import { m } from "#paraglide/messages";

type AccessibilityOptions = Exclude<
  ConstructorParameters<typeof Accessibility>["1"],
  undefined
>;

// English text and functionality is based on https://github.com/clauderic/dnd-kit/blob/ccaf3d583903a5d0b68616310a24aec891ee0d69/packages/dom/src/core/plugins/accessibility/defaults.ts
const accessibilityOptions = {
  screenReaderInstructions: { draggable: m.editor_dnd_instructions() },
  announcements: {
    dragstart: ({ operation: { source } }) => {
      if (!source) {
        return;
      }
      return m.editor_dnd_picked_up({ id: source.id });
    },
    dragover: ({ operation: { source, target } }) => {
      if (!source || source.id === target?.id) {
        return;
      }

      if (target) {
        return m.editor_dnd_moved_over({
          id: source.id,
          targetId: target.id,
        });
      }

      return m.editor_dnd_no_longer_over({ id: source.id });
    },
    dragend: ({ operation: { source, target }, canceled }) => {
      if (!source) {
        return;
      }
      if (canceled) {
        return m.editor_dnd_cancelled({ id: source.id });
      }
      if (target) {
        return m.editor_dnd_dropped_over({
          id: source.id,
          targetId: target.id,
        });
      }
      return m.editor_dnd_dropped({ id: source.id });
    },
  },
} satisfies AccessibilityOptions;

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
        Accessibility.configure(accessibilityOptions),
      ]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropProvider>
  );
};

export { SortableList };
