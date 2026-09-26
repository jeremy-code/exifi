import type { ComponentPropsWithRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: [
    "inline-flex items-center gap-1 rounded font-medium whitespace-nowrap tabular-nums select-none",
  ],
  variants: {
    variant: {
      subtle: [
        "bg-(--color-100) text-(--color-800)",
        "dark:bg-(--color-900) dark:text-(--color-50)",
      ],
      muted: [
        "bg-(--color-200) text-(--color-800)",
        "dark:bg-(--color-800) dark:text-(--color-50)",
      ],
      surface: [
        "border",
        "border-(--color-300) bg-(--color-100) text-(--color-800)",
        "dark:border-(--color-700) dark:bg-(--color-900) dark:text-(--color-50)",
      ],
    },
    color: {
      gray: "[--color-50:var(--color-gray-50)] [--color-100:var(--color-gray-100)] [--color-200:var(--color-gray-200)] [--color-300:var(--color-gray-300)] [--color-700:var(--color-gray-700)] [--color-800:var(--color-gray-800)] [--color-900:var(--color-gray-900)] [--color-950:var(--color-gray-950)]",
      green:
        "[--color-50:var(--color-green-50)] [--color-100:var(--color-green-100)] [--color-200:var(--color-green-200)] [--color-300:var(--color-green-300)] [--color-700:var(--color-green-700)] [--color-800:var(--color-green-800)] [--color-900:var(--color-green-900)] [--color-950:var(--color-green-950)]",
    },
    size: {
      xs: "min-h-4 px-1 text-[0.625rem]/3",
      sm: "min-h-5 px-1.5 text-xs/4",
      md: "min-h-6 px-2 text-sm/5",
      lg: "min-h-7 px-2.5 text-sm/5",
    },
  },
  defaultVariants: {
    variant: "subtle",
    color: "gray",
    size: "sm",
  },
});

type BadgeProps = ComponentPropsWithRef<"div"> &
  VariantProps<typeof badgeVariants>;

const Badge = ({ className, variant, size, color, ...props }: BadgeProps) => {
  return (
    <div
      className={badgeVariants({ className, variant, size, color })}
      {...props}
    />
  );
};

export { Badge, type BadgeProps, badgeVariants };
