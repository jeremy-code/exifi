import {
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
} from "react-aria-components/TextArea";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

const textAreaVariants = tv({
  base: [
    "relative field-sizing-content min-h-[3lh] w-full min-w-0 appearance-none rounded-md text-start",
    "placeholder:text-fg-muted",
  ],
  variants: {
    size: {
      xs: "scroll-pb-1.5 px-2 py-1.5 text-xs",
      sm: "scroll-pb-2 px-2.5 py-2 text-sm",
      md: "scroll-pb-2 px-3 py-2 text-sm",
      lg: "text-md scroll-pb-3 px-4 py-3",
      xl: "text-md scroll-pb-3.5 px-4.5 py-3.5",
    },
    variant: {
      outline: "border border-border bg-surface",
    },
    isDisabled: {
      true: "cursor-not-allowed bg-bg-muted opacity-80",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});

type TextAreaProps = AriaTextAreaProps & VariantProps<typeof textAreaVariants>;

const TextArea = ({ size, variant, ...props }: TextAreaProps) => {
  return (
    <AriaTextArea
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        textAreaVariants({ className, size, variant, ...renderProps }),
      )}
    />
  );
};

export { TextArea, type TextAreaProps, textAreaVariants };
