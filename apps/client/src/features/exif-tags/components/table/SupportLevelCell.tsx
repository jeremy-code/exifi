import type { CellContext } from "@tanstack/react-table";
import type { SupportLevel, TagEntry } from "libexif-wasm";

import { Badge } from "@exifi/ui/components/Badge";

import { SUPPORT_LEVEL_MAP } from "../../../../../../../packages/core/src/exif/constants";

const SupportLevelCell = ({
  getValue,
}: CellContext<TagEntry, SupportLevel>) => {
  const value = getValue();
  const formattedValue = SUPPORT_LEVEL_MAP[value];

  if (value === "UNKNOWN") {
    return <span className="text-fg-muted italic">{formattedValue}</span>;
  }

  return (
    <Badge
      className="select-text"
      color={value === "MANDATORY" ? "success" : "default"}
    >
      {formattedValue}
    </Badge>
  );
};

export { SupportLevelCell };
