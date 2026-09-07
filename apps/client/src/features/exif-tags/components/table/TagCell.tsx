import type { CellContext } from "@tanstack/react-table";
import type { TagEntry } from "libexif-wasm";

import type { Features } from "#components/table/tableFeatures";

const TagCell = ({ getValue }: CellContext<Features, TagEntry, number>) => {
  return (
    <span className="font-mono">
      {"0x" + getValue().toString(16).padStart(4, "0")}
    </span>
  );
};

export { TagCell };
