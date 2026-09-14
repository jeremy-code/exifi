import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

const buttonVariants = tv({
  extend: focusRing,
  base: [
    "relative inline-flex items-center justify-center rounded align-middle font-medium transition select-none",
    "shrink-0", // If inside a flex container, don't let the button shrink
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    color: {
      default: null,
      accent: null,
    },
    variant: {
      muted: null,
      ghost: null,
      surface: "border",
      outline: "border",
    },
    size: {
      xs: "h-8 min-w-8 gap-1 px-2.5 text-xs/4",
      sm: "h-9 min-w-9 gap-2 px-3.5 text-sm/5",
      md: "h-10 min-w-10 gap-2 px-4 text-sm/5",
      lg: "h-11 min-w-11 gap-3 px-5 text-base/6",
      icon: "h-10 min-w-10 gap-2 text-sm/5",
      "icon-sm": "h-9 min-w-9 gap-2 text-sm/5",
      "icon-xs": "h-8 min-w-8 gap-1 text-xs/4",
    },
  },
  compoundVariants: [
    {
      color: "default",
      variant: "muted",
      className: "bg-bg-muted hover:bg-border pressed:bg-fg-subtle",
    },
    {
      color: "accent",
      variant: "muted",
      className:
        "bg-accent text-white hover:bg-accent-hover pressed:bg-accent-pressed",
    },
    {
      color: "default",
      variant: "surface",
      className:
        "border-border bg-bg-muted hover:bg-border pressed:bg-fg-subtle",
    },
    {
      color: "default",
      variant: "ghost",
      className: "bg-transparent hover:bg-bg-muted pressed:bg-border",
    },
    {
      color: "accent",
      variant: "ghost",
      className:
        "bg-transparent hover:bg-accent hover:text-accent-fg pressed:bg-accent-pressed pressed:text-accent-fg",
    },
    {
      color: "default",
      variant: "outline",
      className:
        "border-border bg-transparent hover:bg-bg-muted pressed:bg-border",
    },
  ],
  defaultVariants: {
    color: "default",
    variant: "muted",
    size: "md",
  },
});

type ButtonProps = AriaButtonProps & VariantProps<typeof buttonVariants>;

const Button = ({ variant, color, size, ...props }: ButtonProps) => {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonVariants({ variant, size, color, className, ...renderProps }),
      )}
    />
  );
};

export { Button, type ButtonProps, buttonVariants };
