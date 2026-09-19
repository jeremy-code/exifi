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
  ...props
}: SortingHandlerToggle<TData, TValue>) => {
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
            <ArrowDownWideNarrow className="size-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowUpNarrowWide className="size-4" />
          ) : null}
        </>
      ))}
    </AriaButton>
  );
};

export { SortingHandlerToggle };
