import type { CellContext } from "@tanstack/react-table";
import { ExifTagInfo } from "libexif-wasm";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@exifi/ui/components/Tooltip";

import type { ExifTableRow } from "./columns";

type TagCellProps = CellContext<ExifTableRow, unknown>;

const TagCell = ({ row }: TagCellProps) => {
  if ("entries" in row.original) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger className="text-left">
        {ExifTagInfo.getTitleInIfd(row.original.tag, row.original.ifd)}
      </TooltipTrigger>
      <TooltipContent>
        {ExifTagInfo.getDescriptionInIfd(row.original.tag, row.original.ifd)}
      </TooltipContent>
    </Tooltip>
  );
};

export { TagCell, type TagCellProps };
