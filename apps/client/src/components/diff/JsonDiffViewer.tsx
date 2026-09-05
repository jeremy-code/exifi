import { useTheme } from "next-themes";
import DiffViewer, { DiffMethod } from "react-diff-viewer-continued";

import { Skeleton } from "@exifi/ui/components/Skeleton";

import { diffStyles } from "./diffStyles";

type JsonDiffViewerProps = {
  // Only allow JSON
  oldValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
} & Omit<
  typeof DiffViewer.defaultProps,
  "oldValue" | "newValue" | "compareMethod"
>;

const JsonDiffViewerSkeleton = () => <Skeleton className="h-30 w-full" />;

const JsonDiffViewer = (props: JsonDiffViewerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <DiffViewer
      styles={diffStyles}
      loadingElement={JsonDiffViewerSkeleton}
      {...props}
      compareMethod={DiffMethod.JSON}
      useDarkTheme={resolvedTheme === "dark"}
    />
  );
};

export { JsonDiffViewer, type JsonDiffViewerProps };
