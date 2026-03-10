import { Slot } from "radix-ui";
import type { PrimitivePropsWithRef } from "radix-ui/internal";
import { cn } from "tailwind-variants";

type HorizontalListProps = PrimitivePropsWithRef<"ul">;

const HorizontalList = ({
  className,
  asChild,
  ...props
}: HorizontalListProps) => {
  const Comp = asChild ? Slot.Root : "ul";

  return (
    <Comp className={cn("inline-block list-none", className)} {...props} />
  );
};

type HorizontalListItemProps = PrimitivePropsWithRef<"li">;

const HorizontalListItem = ({
  asChild,
  className,
  ...props
}: HorizontalListItemProps) => {
  const Comp = asChild ? Slot.Root : "li";

  return (
    <Comp
      /**
       * Since JSX strips backslashes in HTML, `String.raw` is necessary for
       * correct CSS output
       *
       * @see {@link https://tailwindcss.com/docs/adding-custom-styles#handling-whitespace}
       */
      className={cn(
        String.raw`inline not-last:after:font-black not-last:after:content-['\a0_·_']`,
        className,
      )}
      {...props}
    />
  );
};

export {
  HorizontalList,
  type HorizontalListProps,
  HorizontalListItem,
  type HorizontalListItemProps,
};
