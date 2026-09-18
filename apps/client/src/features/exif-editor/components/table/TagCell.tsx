import type { CellContext } from "@tanstack/react-table";
import { ExifTagInfo } from "libexif-wasm";

import type { Features } from "#components/table/tableFeatures";
import { getEntryObjectLabel } from "@exifi/core/exif/utils/getEntryObjectLabel";
import {
  Tooltip,
  TooltipTrigger,
  TooltipTarget,
} from "@exifi/ui/components/Tooltip";

import type { ExifTableRow } from "./columns";

type TagCellProps = CellContext<Features, ExifTableRow>;

const TagCell = ({ row }: TagCellProps) => {
  if ("entries" in row.original) {
    return null;
  }

  return (
    <TooltipTrigger>
      <TooltipTarget>
        <span role="button">{getEntryObjectLabel(row.original)}</span>
      </TooltipTarget>
      <Tooltip>
        {ExifTagInfo.getDescriptionInIfd(row.original.tag, row.original.ifd)}
      </Tooltip>
    </TooltipTrigger>
  );
};

export { TagCell, type TagCellProps };
