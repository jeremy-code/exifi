import type { Row, RowData } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { AccessibleIcon, Slot } from "radix-ui";
import type { PrimitivePropsWithRef } from "radix-ui/internal";
import { cn } from "tailwind-variants";

type ExpandRowsProps<TData extends RowData> = {
  row: Row<TData>;
} & PrimitivePropsWithRef<"button">;

const ExpandRows = <TData extends RowData>({
  asChild,
  row,
  children,
  className,
  ...props
}: ExpandRowsProps<TData>) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(
        "flex flex-row items-center gap-2",
        { "cursor-pointer": row.getCanExpand() },
        className,
      )}
      data-state={row.getIsExpanded() ? "open" : "closed"}
      onClick={row.getToggleExpandedHandler()}
      {...props}
    >
      <AccessibleIcon.Root label={row.getIsExpanded() ? "Collapse" : "Expand"}>
        <ChevronRight className="size-3 transition-transform in-data-[state=open]:rotate-90" />
      </AccessibleIcon.Root>
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
};
export { ExpandRows, type ExpandRowsProps };
