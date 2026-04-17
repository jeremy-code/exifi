import type { ComponentPropsWithRef } from "react";

import { X } from "lucide-react";
import { AccessibleIcon, Dialog as DialogPrimitive, Slot } from "radix-ui";
import type { PrimitivePropsWithRef } from "radix-ui/internal";
import { cn } from "tailwind-variants";

import { Button } from "./Button";

const {
  Root: Dialog,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
} = DialogPrimitive;

const DialogOverlay = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => {
  return (
    <DialogPrimitive.Overlay
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

type DialogContentProps = {
  closeButton?: boolean;
} & ComponentPropsWithRef<typeof DialogPrimitive.Content>;

const DialogContent = ({
  className,
  children,
  closeButton = true,
  ...props
}: DialogContentProps) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-1500 flex max-h-[85vh] w-full -translate-x-1/2 -translate-y-1/2 flex-col rounded-md bg-surface shadow-lg",
          "max-w-[min(calc(100%-2rem),--spacing(320))]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {closeButton && (
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              size="icon"
            >
              <AccessibleIcon.Root label="Close">
                <X size={16} />
              </AccessibleIcon.Root>
            </Button>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

const DialogHeader = ({
  asChild,
  className,
  ...props
}: PrimitivePropsWithRef<"div">) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn("flex flex-0 flex-col gap-2 px-6 pt-6 pb-4", className)}
      {...props}
    />
  );
};

const DialogBody = ({
  asChild,
  className,
  ...props
}: PrimitivePropsWithRef<"div">) => {
  const Comp = asChild ? Slot.Root : "div";

  return <Comp className={cn("flex-1 px-6 pt-2 pb-6", className)} {...props} />;
};

type DialogFooterProps = {
  closeButton?: boolean;
} & PrimitivePropsWithRef<"div">;

const DialogFooter = ({
  asChild,
  className,
  closeButton = false,
  children,
  ...props
}: DialogFooterProps) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn(
        "flex items-center justify-end gap-3 px-6 pt-2 pb-4",
        className,
      )}
      {...props}
    >
      {children}
      {closeButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </Comp>
  );
};

const DialogTitle = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof DialogPrimitive.Title>) => {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg/7 font-medium", className)}
      {...props}
    />
  );
};

const DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof DialogPrimitive.Description>) => {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  type DialogContentProps,
  DialogHeader,
  DialogBody,
  DialogFooter,
  type DialogFooterProps,
  DialogTitle,
  DialogDescription,
};
