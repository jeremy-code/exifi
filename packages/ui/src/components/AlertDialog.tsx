import type { ComponentPropsWithRef } from "react";

import { AlertDialog as AlertDialogPrimitive, Slot } from "radix-ui";
import type { PrimitivePropsWithRef } from "radix-ui/internal";
import { cn, tv, type VariantProps } from "tailwind-variants";

const {
  Root: AlertDialog,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
} = AlertDialogPrimitive;

const AlertDialogOverlay = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof AlertDialogPrimitive.Overlay>) => {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed top-0 left-0 z-50 h-dvh w-dvw bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
};

const alertDialogContentVariants = tv({
  base: [
    "fixed top-1/2 left-1/2 z-1500 max-h-[85vh] w-full -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  ],
  variants: {
    size: {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type AlertDialogContentProps = ComponentPropsWithRef<
  typeof AlertDialogPrimitive.Content
> &
  VariantProps<typeof alertDialogContentVariants>;

const AlertDialogContent = ({
  className,
  size = "md",
  ...props
}: AlertDialogContentProps) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-size={size}
        className={alertDialogContentVariants({ className, size })}
        {...props}
      />
    </AlertDialogPortal>
  );
};

const AlertDialogHeader = ({
  asChild,
  className,
  ...props
}: PrimitivePropsWithRef<"div">) => {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp className={cn("flex-[0_1_0%] px-6 py-4", className)} {...props} />
  );
};

const AlertDialogBody = ({
  asChild,
  className,
  ...props
}: PrimitivePropsWithRef<"div">) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp className={cn("flex-[0_1_0%] px-6 py-2", className)} {...props} />
  );
};

const AlertDialogFooter = ({
  asChild,
  className,
  ...props
}: PrimitivePropsWithRef<"div">) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn("flex items-center justify-end px-6 py-4", className)}
      {...props}
    />
  );
};

const AlertDialogTitle = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof AlertDialogPrimitive.Title>) => {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg font-bold", className)}
      {...props}
    />
  );
};

const AlertDialogDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof AlertDialogPrimitive.Description>) => {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground md:text-pretty", className)}
      {...props}
    />
  );
};

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
