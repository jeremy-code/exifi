import type { ComponentPropsWithRef } from "react";

import { TriangleAlert } from "lucide-react";
import { Text, type TextProps } from "react-aria-components/Text";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const calloutVariants = tv({
  base: "mx-auto flex items-center gap-4 rounded p-4",
  variants: {
    variant: {
      subtle: [
        "bg-(--color-100) text-(--color-700)",
        "dark:bg-(--color-900) dark:text-(--color-300)",
      ],
      surface: [
        "border",
        "border-(--color-200) bg-(--color-100) text-(--color-700)",
        "dark:border-(--color-700) dark:bg-(--color-900) dark:text-(--color-300)",
      ],
    },
    color: {
      red: "[--color-100:var(--color-red-100)] [--color-200:var(--color-red-200)] [--color-300:var(--color-red-300)] [--color-700:var(--color-red-700)] [--color-900:var(--color-red-900)]",
      yellow:
        "[--color-100:var(--color-yellow-100)] [--color-200:var(--color-yellow-300)] [--color-300:var(--color-yellow-300)] [--color-700:var(--color-yellow-700)] [--color-900:var(--color-yellow-900)]",
    },
  },
  defaultVariants: {
    variant: "subtle",
  },
});

type CalloutProps = ComponentPropsWithRef<"div"> &
  VariantProps<typeof calloutVariants>;

const Callout = ({
  children,
  className,
  color,
  variant,
  ...props
}: CalloutProps) => {
  return (
    <div className={calloutVariants({ className, variant, color })} {...props}>
      <div className="w-8">
        <TriangleAlert aria-label="Alert" />
      </div>
      {children}
    </div>
  );
};

const CalloutText = ({ className, ...props }: TextProps) => {
  return (
    <Text
      className={twMerge("m-0 text-sm/6 font-normal", className)}
      {...props}
    />
  );
};

export { Callout, type CalloutProps, CalloutText };
