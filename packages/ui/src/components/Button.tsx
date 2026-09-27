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
      gray: "[--color-50:var(--color-gray-50)] [--color-100:var(--color-gray-100)] [--color-200:var(--color-gray-200)] [--color-300:var(--color-gray-300)] [--color-400:var(--color-gray-400)] [--color-500:var(--color-gray-500)] [--color-600:var(--color-gray-600)] [--color-700:var(--color-gray-700)] [--color-800:var(--color-gray-800)] [--color-900:var(--color-gray-900)] [--color-950:var(--color-gray-950)]",
      accent:
        "[--color-50:var(--color-accent-50)] [--color-100:var(--color-accent-100)] [--color-200:var(--color-accent-200)] [--color-300:var(--color-accent-300)] [--color-400:var(--color-accent-400)] [--color-500:var(--color-accent-500)] [--color-600:var(--color-accent-600)] [--color-700:var(--color-accent-700)] [--color-800:var(--color-accent-800)] [--color-900:var(--color-accent-900)] [--color-950:var(--color-accent-950)]",
      blue: "[--color-50:var(--color-blue-50)] [--color-100:var(--color-blue-100)] [--color-200:var(--color-blue-200)] [--color-300:var(--color-blue-300)] [--color-400:var(--color-blue-400)] [--color-500:var(--color-blue-500)] [--color-600:var(--color-blue-600)] [--color-700:var(--color-blue-700)] [--color-800:var(--color-blue-800)] [--color-900:var(--color-blue-900)] [--color-950:var(--color-blue-950)]",
      red: "[--color-50:var(--color-red-50)] [--color-100:var(--color-red-100)] [--color-200:var(--color-red-200)] [--color-300:var(--color-red-300)] [--color-400:var(--color-red-400)] [--color-500:var(--color-red-500)] [--color-600:var(--color-red-600)] [--color-700:var(--color-red-700)] [--color-800:var(--color-red-800)] [--color-900:var(--color-red-900)] [--color-950:var(--color-red-950)]",
    },
    variant: {
      muted: [
        "bg-(--color-200) text-(--color-800) hover:bg-(--color-300) pressed:bg-(--color-400)",
        "dark:bg-(--color-800) dark:text-(--color-50) dark:hover:bg-(--color-700) dark:pressed:bg-(--color-600)",
      ],
      ghost: [
        "bg-transparent",
        "text-(--color-800) hover:bg-(--color-200) pressed:bg-(--color-300)",
        "dark:text-(--color-200) dark:hover:bg-(--color-800) dark:pressed:bg-(--color-700)",
      ],
      surface: [
        "border",
        "border-(--color-300) bg-(--color-200) text-(--color-800) hover:bg-(--color-300) pressed:bg-(--color-400)",
        "dark:border-(--color-700) dark:bg-(--color-800) dark:text-(--color-50) dark:hover:bg-(--color-700) dark:pressed:bg-(--color-600)",
      ],
      outline: [
        "border bg-transparent",
        "border-(--color-300) text-(--color-800) hover:bg-(--color-100) pressed:bg-(--color-200)",
        "dark:border-(--color-700) dark:text-(--color-200) dark:hover:bg-(--color-900) dark:pressed:bg-(--color-800)",
      ],
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
  defaultVariants: {
    color: "gray",
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
