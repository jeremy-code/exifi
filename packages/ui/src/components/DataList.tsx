import type { ComponentPropsWithRef } from "react";

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

type DataListProps = ComponentPropsWithRef<"dl"> &
  VariantProps<typeof dataListVariants>;

const DataList = ({
  className,
  orientation = "horizontal",
  size = "md",
  variant = "subtle",
  ...props
}: DataListProps) => {
  return (
    <dl
      data-orientation={orientation}
      data-size={size}
      data-variant={variant}
      className={dataListVariants({ className, orientation, size, variant })}
      {...props}
    />
  );
};

type DataListItemProps = ComponentPropsWithRef<"div">;

const DataListItem = ({ className, ...props }: DataListItemProps) => {
  return (
    <div
      className={cn(
        "inline-flex gap-1",
        "group-orientation-horizontal/data-list:flex-row group-orientation-vertical/data-list:flex-col",
        "group-data-[size=sm]/data-list:text-xs/4",
        "group-data-[size=md]/data-list:text-sm/5",
        "group-data-[size=lg]/data-list:text-base/6",
        className,
      )}
      {...props}
    />
  );
};

type DataListItemLabelProps = ComponentPropsWithRef<"dt">;

const DataListItemLabel = ({ className, ...props }: DataListItemLabelProps) => {
  return (
    <dt
      className={cn(
        "flex min-w-30 items-start gap-1 text-fg-muted",
        "group-data-[variant=bold]/data-list:font-medium",
        className,
      )}
      {...props}
    />
  );
};

type DataListItemValueProps = ComponentPropsWithRef<"dd">;

const DataListItemValue = ({ className, ...props }: DataListItemValueProps) => {
  return <dd className={cn("flex min-w-0 flex-1", className)} {...props} />;
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
