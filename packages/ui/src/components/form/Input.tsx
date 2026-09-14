import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
} from "react-aria-components/Input";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: [
    "[-webkit-tap-highlight-color:transparent]' flex h-9 w-full appearance-none rounded border-0 border-border bg-surface px-3 py-1 text-start text-sm outline-0 transition-opacity",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-fg-muted",
  ],
  variants: {
    size: {
      xs: "h-8 min-w-8 px-2 text-xs/4",
      sm: "h-9 min-w-9 px-2.5 text-sm/5",
      md: "h-10 min-w-10 px-3 text-sm/5",
      lg: "h-11 min-w-11 px-4 text-base/6",
    },
    isDisabled: {
      true: [
        "cursor-not-allowed",
        "text-gray-200 placeholder:text-gray-200",
        "dark:text-gray-600 dark:placeholder:text-gray-600",
      ],
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type InputProps = Omit<AriaInputProps, "size"> &
  VariantProps<typeof inputVariants>;

const Input = ({ size, ...props }: InputProps) => {
  return (
    <AriaInput
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputVariants({ ...renderProps, size, className }),
      )}
    />
  );
};

export { Input, type InputProps, inputVariants };
