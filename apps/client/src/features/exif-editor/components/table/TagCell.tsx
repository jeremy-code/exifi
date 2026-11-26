import type { CellContext } from "@tanstack/react-table";

import type { Features } from "#components/table/tableFeatures";
import { getExifTagDescription } from "#lib/exif/labels";
import {
  Tooltip,
  TooltipTrigger,
  TooltipTarget,
} from "@exifi/ui/components/Tooltip";
import { focusRing } from "@exifi/ui/utils/focusRing";

import { getEntryLabel } from "../../utils/getEntryLabel";
import type { ExifTableRow } from "./columns";

type TagCellProps = CellContext<Features, ExifTableRow>;

const TagCell = ({ row }: TagCellProps) => {
  if ("entries" in row.original) {
    return null;
  }

  return (
    <TooltipTrigger>
      <TooltipTarget>
        <span
          role="button"
          className={focusRing({ className: "focus-visible:outline-2" })}
        >
          {getEntryLabel(row.original)}
        </span>
      </TooltipTarget>
      <Tooltip>
        {getExifTagDescription(row.original.tag, row.original.ifd)}
      </Tooltip>
    </TooltipTrigger>
  );
};

export { TagCell, type TagCellProps };
