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
  children,
  className,
  ...props
}: SortingHandlerToggle<TData, TValue>) => {
  // eslint-disable-next-line react-compiler/react-compiler -- TanStack Table is not compatible with React compiler
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
