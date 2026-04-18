import { Slot } from "radix-ui";
import { type PrimitivePropsWithRef } from "radix-ui/internal";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: [
    "relative inline-flex cursor-pointer items-center justify-center rounded align-middle font-medium transition select-none",
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
      className: "bg-muted hover:bg-border",
    },
    {
      color: "accent",
      variant: "muted",
      className: "bg-accent text-white hover:bg-accent-hover",
    },
    {
      color: "default",
      variant: "surface",
      className: "border-border bg-muted hover:bg-border",
    },
    {
      color: "default",
      variant: "ghost",
      className: "bg-transparent hover:bg-muted",
    },
    {
      color: "default",
      variant: "outline",
      className: "border-border bg-transparent hover:bg-muted",
    },
  ],
  defaultVariants: {
    color: "default",
    variant: "muted",
    size: "md",
  },
});

type ButtonProps = PrimitivePropsWithRef<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = ({
  asChild,
  className,
  color,
  variant,
  size,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={buttonVariants({ className, color, variant, size })}
      {...props}
    />
  );
};

export { buttonVariants, Button, type ButtonProps };
