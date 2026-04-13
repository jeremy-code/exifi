import { useState } from "react";

import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { useExifEditorStoreContext } from "#hooks/useExifEditor";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@exiftools/ui/components/AlertDialog";
import { Button } from "@exiftools/ui/components/Button";

const DeleteEntriesButton = ({ table }: { table: Table<ExifEntryObject> }) => {
  const removeExifEntries = useExifEditorStoreContext(
    (state) => state.removeExifEntries,
  );
  const [rowsToDelete, setRowsToDelete] = useState<ExifEntryObject[]>([]);

  return (
    <AlertDialog
      open={rowsToDelete.length !== 0}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setRowsToDelete([]);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => {
            setRowsToDelete(
              Object.entries(table.getState().rowSelection)
                .filter(
                  ([key, value]) => !key.startsWith("ifd:") && value === true,
                )
                .map(([selectedRow]) => table.getRow(selectedRow).original),
            );
          }}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        aria-description="Delete Exif entries alert dialog"
        className="max-w-[min(calc(100%-2rem),--spacing(140))]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          This action will delete {rowsToDelete.length} Exif entries.
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                if (rowsToDelete.length === 0) {
                  throw new Error("No rows to delete");
                }
                removeExifEntries(rowsToDelete);
              }}
              className="ml-3"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteEntriesButton };
