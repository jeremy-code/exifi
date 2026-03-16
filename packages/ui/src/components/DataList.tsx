import { Slot } from "radix-ui";
import type { PrimitivePropsWithRef } from "radix-ui/internal";
import { cn, tv, type VariantProps } from "tailwind-variants";

const dataListVariants = tv({
  base: "group/data-list flex flex-col gap-4",
  variants: {
    orientation: { horizontal: null, vertical: null },
    size: { sm: null, md: null, lg: null },
    variant: { subtle: null, bold: null },
  },

  defaultVariants: {
    orientation: "horizontal",
    size: "md",
    variant: "subtle",
  },
});

type DataListProps = PrimitivePropsWithRef<"dl"> &
  VariantProps<typeof dataListVariants>;

const DataList = ({
  asChild,
  className,
  orientation,
  size,
  variant,
  ...props
}: DataListProps) => {
  const Comp = asChild ? Slot.Root : "dl";

  return (
    <Comp
      data-orientation={
        orientation ?? dataListVariants.defaultVariants.orientation
      }
      data-size={size ?? dataListVariants.defaultVariants.size}
      data-variant={variant ?? dataListVariants.defaultVariants.variant}
      className={dataListVariants({ className, orientation, size, variant })}
      {...props}
    />
  );
};

type DataListItemProps = PrimitivePropsWithRef<"div">;

const DataListItem = ({ asChild, className, ...props }: DataListItemProps) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn(
        "inline-flex gap-1",
        "group-data-[orientation=horizontal]/data-list:flex-row group-data-[orientation=vertical]/data-list:flex-col",
        "group-data-[size=sm]/data-list:text-xs/4",
        "group-data-[size=md]/data-list:text-sm/5",
        "group-data-[size=lg]/data-list:text-md/6",
        className,
      )}
      {...props}
    />
  );
};

type DataListItemLabelProps = PrimitivePropsWithRef<"dt">;

const DataListItemLabel = ({
  asChild,
  className,
  ...props
}: DataListItemLabelProps) => {
  const Comp = asChild ? Slot.Root : "dt";

  return (
    <Comp
      className={cn(
        "flex min-w-30 items-center gap-1 text-muted-foreground",
        "group-data-[variant=bold]/data-list:font-medium",
        className,
      )}
      {...props}
    />
  );
};

type DataListItemValueProps = PrimitivePropsWithRef<"dd">;

const DataListItemValue = ({
  asChild,
  className,
  ...props
}: DataListItemValueProps) => {
  const Comp = asChild ? Slot.Root : "dd";

  return <Comp className={cn("flex min-w-0 flex-1", className)} {...props} />;
};

export {
  DataList,
  type DataListProps,
  DataListItem,
  type DataListItemProps,
  DataListItemLabel,
  type DataListItemLabelProps,
  DataListItemValue,
  type DataListItemValueProps,
};
