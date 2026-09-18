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
  ...props
}: ExpandRowsProps<TData>) => {
  return (
    <AriaButton
      data-state={row.getIsExpanded() ? "open" : "closed"}
      onPress={row.getToggleExpandedHandler()}
      aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        cn(
          "flex flex-row items-center gap-2",
          { "cursor-pointer": row.getCanExpand() },
          { "cursor-not-allowed text-fg-muted": !row.getCanExpand() },
        ),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <ChevronRight className="size-3 transition-transform in-data-[state=open]:rotate-90" />
          {children}
        </>
      ))}
    </AriaButton>
  );
};
export { ExpandRows, type ExpandRowsProps };
