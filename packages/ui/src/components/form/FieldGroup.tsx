import {
  Group,
  type GroupProps as FieldGroupProps,
} from "react-aria-components/Group";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

import { focusRing } from "../../utils/focusRing";

const fieldBorderVariants = tv({
  base: "transition",
  variants: {
    isFocusWithin: {
      false:
        "border-border hover:border-fg-subtle forced-colors:border-[ButtonBorder]",
      true: "border-fg-muted forced-colors:border-[Highlight]",
    },
    isInvalid: {
      true: "border-destructive dark:border-destructive forced-colors:border-[Mark]",
    },
    isDisabled: {
      true: "border-bg-muted hover:border-bg-muted forced-colors:border-[GrayText]",
    },
  },
});

const fieldGroupVariants = tv({
  extend: focusRing,
  base: [
    "group box-border flex h-9 items-center overflow-hidden rounded border bg-surface transition",
    "forced-colors:bg-[Field]",
  ],
  variants: fieldBorderVariants.variants,
});

const FieldGroup = (props: FieldGroupProps) => {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupVariants({ ...renderProps, className }),
      )}
    />
  );
};

export {
  FieldGroup,
  type FieldGroupProps,
  fieldBorderVariants,
  fieldGroupVariants,
};
