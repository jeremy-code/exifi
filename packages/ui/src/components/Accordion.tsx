import type { ComponentPropsWithRef } from "react";

import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive, Slot } from "radix-ui";
import { cn, tv, type VariantProps } from "tailwind-variants";

const accordionVariants = tv({
  base: ["group/accordion flex w-full flex-col"],
  variants: {
    variant: {
      outline: null,
      enclosed: "overflow-hidden rounded-sm border bg-surface",
    },
    size: {
      sm: "[--accordion-padding-x:--spacing(3)] [--accordion-padding-y:--spacing(2)]",
      md: "[--accordion-padding-x:--spacing(4)] [--accordion-padding-y:--spacing(2)]",
      lg: "[--accordion-padding-x:--spacing(4.5)] [--accordion-padding-y:--spacing(3)]",
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
});

const Accordion = ({
  variant,
  size,
  className,
  ...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants>) => {
  return (
    <AccordionPrimitive.Root
      data-variant={variant}
      className={accordionVariants({ variant, size, className })}
      {...props}
    />
  );
};

const AccordionItem = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Item>) => {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "[overflow-anchor:none] group-data-[variant=enclosed]/accordion:not-last:border-b",
        className,
      )}
      {...props}
    />
  );
};

type AccordionTriggerProps = {
  headerProps?: ComponentPropsWithRef<typeof AccordionPrimitive.Header>;
} & ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = ({
  className,
  headerProps,
  children,
  ...props
}: AccordionTriggerProps) => {
  return (
    <AccordionPrimitive.Header {...headerProps}>
      <AccordionPrimitive.Trigger
        className={cn(
          "group/accordion-trigger text-md/6 flex w-full items-center justify-between gap-3 rounded-sm px-(--accordion-padding-x) py-(--accordion-padding-y) text-start font-medium transition-opacity",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden={true}
          className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

type AccordionContentProps = {
  bodyProps?: ComponentPropsWithRef<"div">;
} & ComponentPropsWithRef<typeof AccordionPrimitive.Content>;

const AccordionContent = ({
  asChild,
  className,
  bodyProps,
  children,
  ...props
}: AccordionContentProps) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden rounded-sm px-(--accordion-padding-x) data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      <Comp
        {...bodyProps}
        className={cn(
          "pt-(--accordion-padding-y) pb-[calc(var(--accordion-padding-y)*2)] text-sm",
          bodyProps?.className,
        )}
      >
        {children}
      </Comp>
    </AccordionPrimitive.Content>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
