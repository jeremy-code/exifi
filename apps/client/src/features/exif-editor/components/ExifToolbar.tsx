import { Toolbar, type ToolbarProps } from "@exifi/ui/components/Toolbar";

import { ExifDownload } from "./ExifDownload";
import { ExifMenu } from "./ExifMenu";
import { AddEntryDialog } from "./dialogs/AddEntryDialog";
import { AddGpsEntriesDialog } from "./dialogs/AddGpsEntriesDialog";
import { DiffDialog } from "./dialogs/DiffDialog";

type ExifToolbarProps = Omit<ToolbarProps, "children">;

const ExifToolbar = (props: ExifToolbarProps) => {
  return (
    <Toolbar aria-label="Exif editor toolbar" {...props}>
      <ExifDownload />
      <DiffDialog />
      <AddEntryDialog />
      <AddGpsEntriesDialog />
      <ExifMenu />
    </Toolbar>
  );
};

export { ExifToolbar };
