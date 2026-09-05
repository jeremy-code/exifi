import { createContext, use, type ComponentPropsWithRef } from "react";

import { ChevronDown } from "lucide-react";
import {
  DisclosureGroup,
  Disclosure,
  type DisclosureProps as AccordionItemProps,
  type DisclosureGroupProps,
  Heading,
  Button,
  type HeadingProps,
  type ButtonProps,
  type DisclosurePanelProps,
  DisclosurePanel,
} from "react-aria-components/DisclosureGroup";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

const accordionVariants = tv({
  slots: {
    base: "w-full [--accordion-radius:var(--radius-sm)]",
    item: "[overflow-anchor:none]",
    header: [
      "flex w-full items-center justify-between gap-3 rounded-(--accordion-radius) py-(--accordion-padding-y) text-start font-medium",
    ],
    panel:
      "h-(--disclosure-panel-height) overflow-hidden rounded-(--accordion-radius) motion-safe:transition-[height]",
    panelBody:
      "pt-(--accordion-padding-y) pb-[calc(var(--accordion-padding-y)*2)]",
  },
  variants: {
    variant: {
      outline: {
        item: "border-b border-b-border",
      },
      subtle: {
        header: "px-(--accordion-padding-x)",
        panel: "px-(--accordion-padding-x)",
        item: "rounded-(--accordion-radius) expanded:bg-bg-subtle",
      },
      enclosed: {
        base: "rounded-sm border border-border bg-surface",
        item: "not-last:border-b not-last:border-b-border",
        header: "px-(--accordion-padding-x)",
        panel: "px-(--accordion-padding-x)",
      },
      plain: null,
    },
    size: {
      sm: {
        base: "[--accordion-padding-x:--spacing(3)] [--accordion-padding-y:--spacing(2)]",
        header: "text-sm",
      },
      md: {
        base: "[--accordion-padding-x:--spacing(4)] [--accordion-padding-y:--spacing(2)]",
        header: "text-md",
      },
      lg: {
        base: "[--accordion-padding-x:--spacing(4.5)] [--accordion-padding-y:--spacing(3)]",
        header: "text-lg",
      },
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
});

const AccordionContext = createContext<ReturnType<
  typeof accordionVariants
> | null>(null);

const useAccordionContext = () => {
  const accordionContext = use(AccordionContext);

  if (accordionContext === null) {
    throw new Error("useAccordionContext must be used within an Accordion");
  }

  return accordionContext;
};

type AccordionProps = DisclosureGroupProps &
  VariantProps<typeof accordionVariants>;

const Accordion = ({ variant, size, className, ...props }: AccordionProps) => {
  const computedAccordionVariants = accordionVariants({
    variant,
    size,
  });

  return (
    <AccordionContext value={computedAccordionVariants}>
      <DisclosureGroup
        data-variant={variant}
        className={composeRenderProps(className, (className, renderProps) =>
          computedAccordionVariants.base({ ...renderProps, className }),
        )}
        {...props}
      />
    </AccordionContext>
  );
};

const AccordionItem = ({ className, ...props }: AccordionItemProps) => {
  const { item } = useAccordionContext();

  return (
    <Disclosure
      className={composeRenderProps(className, (className, renderProps) =>
        item({ className, ...renderProps }),
      )}
      {...props}
    />
  );
};

type AccordionHeaderProps = {
  buttonProps?: ButtonProps;
} & HeadingProps;

const AccordionHeader = ({
  buttonProps,
  children,
  ...props
}: AccordionHeaderProps) => {
  const { header } = useAccordionContext();

  return (
    <Heading {...props}>
      <Button
        slot="trigger"
        className={composeRenderProps(
          buttonProps?.className,
          (className, renderProps) =>
            cn(
              header({ className, ...renderProps }),
              focusRing({ ...renderProps }),
            ) ?? "",
        )}
        {...buttonProps}
      >
        {composeRenderProps(children, (children) => (
          <>
            {children}
            <ChevronDown
              aria-hidden={true}
              className="size-4 shrink-0 text-fg-muted transition-transform group-expanded/accordion-item:rotate-180"
            />
          </>
        ))}
      </Button>
    </Heading>
  );
};

type AccordionPanelProps = {
  bodyProps?: ComponentPropsWithRef<"div">;
} & DisclosurePanelProps;

const AccordionPanel = ({
  className,
  bodyProps,
  children,
  ...props
}: AccordionPanelProps) => {
  const { panel, panelBody } = useAccordionContext();

  return (
    <DisclosurePanel
      className={composeRenderProps(className, (className, renderProps) =>
        panel({ className, ...renderProps }),
      )}
      {...props}
    >
      <div
        {...bodyProps}
        className={panelBody({ className: bodyProps?.className })}
      >
        {children}
      </div>
    </DisclosurePanel>
  );
};

export {
  Accordion,
  type AccordionProps,
  accordionVariants,
  AccordionItem,
  type AccordionItemProps,
  AccordionHeader,
  type AccordionHeaderProps,
  AccordionPanel,
  type AccordionPanelProps,
};
