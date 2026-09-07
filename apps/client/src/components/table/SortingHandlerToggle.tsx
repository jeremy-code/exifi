import type { Column, RowData } from "@tanstack/react-table";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { composeTailwindRenderProps } from "@exifi/ui/utils/composeTailwindRenderProps";

import type { Features } from "./tableFeatures";

type SortingHandlerToggle<TData extends RowData, TValue> = {
  column: Column<Features, TData, TValue>;
} & AriaButtonProps;

const SortingHandlerToggle = <TData extends RowData, TValue>({
  column,
  children,
  className,
  ...props
}: SortingHandlerToggle<TData, TValue>) => {
  "use no memo";

  return (
    <AriaButton
      className={composeTailwindRenderProps(
        className,
        "flex cursor-pointer items-center gap-2",
      )}
      onPress={column.getToggleSortingHandler()}
      {...props}
    >
      {composeRenderProps(children, (children) => (
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
