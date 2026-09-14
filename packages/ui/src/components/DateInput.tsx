import {
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps,
} from "react-aria-components/DateField";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

import { fieldGroupVariants } from "./form/FieldGroup";

const dateSegmentVariants = tv({
  base: [
    "inline rounded-sm p-0.5 whitespace-nowrap text-fg-bolder caret-transparent outline-0 forced-color-adjust-none [-webkit-tap-highlight-color:transparent]",
    "forced-colors:text-[ButtonText] type-literal:p-0",
  ],
  variants: {
    isPlaceholder: {
      true: "text-fg-muted",
    },
    isDisabled: {
      true: "text-gray-200 dark:text-gray-600 forced-colors:text-[GrayText]",
    },
    isFocused: {
      true: [
        "bg-accent text-accent-fg",
        "forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
      ],
    },
  },
});

const DateSegment = (props: DateSegmentProps) => {
  return (
    <AriaDateSegment
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        dateSegmentVariants({ className, ...renderProps }),
      )}
    />
  );
};

const dateInputVariants = tv({
  extend: fieldGroupVariants,
  base: [
    "inline h-9 min-w-37.5 cursor-text scrollbar-none overflow-visible px-3 text-sm/8.5 whitespace-nowrap",
    "placeholder:text-fg-muted",
  ],
  variants: {
    isInvalid: {
      true: "cursor-default",
    },
  },
});

type DateInputProps = {
  dateSegmentProps?: Omit<DateSegmentProps, "segment">;
} & Omit<AriaDateInputProps, "children">;

const DateInput = ({ dateSegmentProps, ...props }: DateInputProps) => {
  return (
    <AriaDateInput
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        dateInputVariants({ ...renderProps, className }),
      )}
    >
      {(segment) => <DateSegment segment={segment} {...dateSegmentProps} />}
    </AriaDateInput>
  );
};

export {
  DateSegment,
  type DateSegmentProps,
  dateSegmentVariants,
  DateInput,
  type DateInputProps,
  dateInputVariants,
};
