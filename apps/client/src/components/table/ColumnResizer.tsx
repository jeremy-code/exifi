import type { ComponentPropsWithRef, CSSProperties } from "react";

import { type RowData, type Header as HeaderType } from "@tanstack/react-table";
import { cn } from "tailwind-variants";

type ColumnResizerProps<TData extends RowData, TValue> = {
  header: HeaderType<TData, TValue>;
} & ComponentPropsWithRef<"div">;

const ColumnResizer = <TData extends RowData, TValue>({
  header,
  className,
  children,
  ...props
}: ColumnResizerProps<TData, TValue>) => {
  const { table } = header.getContext();

  return (
    <div
      role="presentation"
      onDoubleClick={() => header.column.resetSize()}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn(
        "absolute inset-y-2 w-1 cursor-col-resize touch-none select-none",
        "after:absolute after:inset-x-px after:inset-y-0 after:rounded after:bg-border hover:rounded-full hover:bg-blue-600 hover:after:invisible",
        "data-[resizer-dir=ltr]:-right-0.5 data-[resizer-dir=ltr]:group-last:right-2",
        "data-[resizer-dir=rtl]:-left-0.5 data-[resizer-dir=rtl]:group-first:left-2",
        {
          "rounded bg-blue-600 after:invisible": header.column.getIsResizing(),
          "transition-transform data-[resizer-dir=ltr]:translate-x-(--resizer-offset) data-[resizer-dir=rtl]:-translate-x-(--resizer-offset)":
            table.options.columnResizeMode === "onEnd",
        },
        className,
      )}
      data-resizer-dir={table.options.columnResizeDirection}
      style={
        {
          "--resizer-offset":
            table.options.columnResizeMode === "onEnd" &&
            header.column.getIsResizing()
              ? `${table.getState().columnSizingInfo.deltaOffset ?? 0}px`
              : "0px",
        } as CSSProperties
      }
      {...props}
    >
      <input
        type="range"
        className="sr-only"
        aria-orientation="horizontal"
        aria-label="Resizer"
        min={header.column.columnDef.minSize}
        max={header.column.columnDef.maxSize}
        value={header.column.getSize()}
        aria-valuetext={`${header.column.getSize()} pixels`}
        readOnly
      />
      {children}
    </div>
  );
};

export { ColumnResizer };
