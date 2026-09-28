import { tv } from "tailwind-variants";

const focusRing = tv({
  base: "outline-offset-2 outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight]",
  variants: {
    isFocusVisible: {
      false: "outline-0",
      true: "outline-2",
    },
  },
});

export { focusRing };
