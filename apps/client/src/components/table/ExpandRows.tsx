import type { Row, RowData } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { cn } from "tailwind-variants";

import { composeTailwindRenderProps } from "@exifi/ui/utils/composeTailwindRenderProps";

import type { Features } from "./tableFeatures";

type ExpandRowsProps<TData extends RowData> = {
  row: Row<Features, TData>;
} & AriaButtonProps;

const ExpandRows = <TData extends RowData>({
  row,
  children,
  className,
  ...props
}: ExpandRowsProps<TData>) => {
  return (
    <AriaButton
      className={composeTailwindRenderProps(
        className,
        cn(
          "flex flex-row items-center gap-2",
          { "cursor-pointer": row.getCanExpand() },
          { "cursor-not-allowed text-fg-muted": !row.getCanExpand() },
        ),
      )}
      data-state={row.getIsExpanded() ? "open" : "closed"}
      onPress={row.getToggleExpandedHandler()}
      aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <ChevronRight className="size-3 transition-transform in-data-[state=open]:rotate-90" />
          {children}
        </>
      ))}
    </AriaButton>
  );
};
export { ExpandRows, type ExpandRowsProps };
