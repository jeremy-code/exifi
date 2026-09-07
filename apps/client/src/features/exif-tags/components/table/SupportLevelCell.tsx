import type { CellContext } from "@tanstack/react-table";
import type { SupportLevel, TagEntry } from "libexif-wasm";

import type { Features } from "#components/table/tableFeatures";
import { SUPPORT_LEVEL_MAP } from "@exifi/core/exif/constants";
import { Badge } from "@exifi/ui/components/Badge";

const SupportLevelCell = ({
  getValue,
}: CellContext<Features, TagEntry, SupportLevel>) => {
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
