import { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

import type { RowSelectionState, Table } from "@tanstack/react-table";
import { IFD_NAMES } from "libexif-wasm";

import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";

import { DeleteEntriesDialog } from "../dialogs/DeleteEntriesDialog";
import type { ExifTableRow } from "./columns";

const SelectionBar = ({
  rowSelection,
  table,
}: {
  rowSelection: RowSelectionState;
  table: Table<ExifTableRow>;
}) => {
  const selectedRowIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(
          ([key, value]) =>
            !IFD_NAMES.map((_, index) => String(index)).includes(key) &&
            value === true,
        )
        .map(([rowId]) => rowId),
    [rowSelection],
  );
  const removeExifEntries = useExifEditor((state) => state.removeExifEntries);
  const deleteRows = useCallback(() => {
    const selectedEntries = selectedRowIds.flatMap((selectedRowId) => {
      const selectedRow = table.getRow(selectedRowId).original;
      return !("entries" in selectedRow) ? [selectedRow] : [];
    });
    if (selectedEntries.length === 0) {
      throw new Error("Zero entries somehow selected");
    }

    removeExifEntries(selectedEntries);
    table.resetRowSelection();
  }, [selectedRowIds, removeExifEntries, table]);

  if (selectedRowIds.length === 0) {
    return null;
  }

  // TODO: Consider https://react-aria.adobe.com/PortalProvider
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+--spacing(4))] flex justify-center">
      <div className="pointer-events-auto flex items-center gap-3 rounded-[0.375rem] bg-surface px-3 py-2.5 shadow-md">
        <button className="inline-flex items-center gap-2 self-stretch rounded rounded-[0.25rem] border border-dashed px-4 py-1 text-sm">
          {selectedRowIds.length} selected
        </button>
        <div className="h-5 w-px bg-border" />
        <DeleteEntriesDialog rows={selectedRowIds} deleteRows={deleteRows} />
      </div>
    </div>,
    document.body,
  );
};

export { SelectionBar };
