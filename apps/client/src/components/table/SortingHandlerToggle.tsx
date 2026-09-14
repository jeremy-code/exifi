import type { Column, RowData } from "@tanstack/react-table";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { composeTailwindRenderProps } from "@exifi/ui/utils/composeTailwindRenderProps";

type SortingHandlerToggle<TData extends RowData, TValue> = {
  column: Column<TData, TValue>;
} & AriaButtonProps;

const SortingHandlerToggle = <TData extends RowData, TValue>({
  column,
  ...props
}: SortingHandlerToggle<TData, TValue>) => {
  "use no memo";

  return (
    <AriaButton
      onPress={column.getToggleSortingHandler()}
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex cursor-pointer items-center gap-2",
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {column.getIsSorted() === "asc" ? (
            <ArrowDownWideNarrow size={16} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowUpNarrowWide size={16} />
          ) : null}
        </>
      ))}
    </AriaButton>
  );
};

export { SortingHandlerToggle };
