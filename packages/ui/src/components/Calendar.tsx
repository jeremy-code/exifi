import { type ComponentPropsWithRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarCell as AriaCalendarCell,
  type CalendarCellProps,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  Heading,
  type DateValue,
} from "react-aria-components/Calendar";
import { useLocale } from "react-aria-components/I18nProvider";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { cn, tv } from "tailwind-variants";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";
import { focusRing } from "../utils/focusRing";
import { Button } from "./Button";
import { ErrorMessage } from "./form";

const calendarCellVariants = tv({
  extend: focusRing,
  base: "flex aspect-square w-[calc(100cqw/7)] cursor-default items-center justify-center rounded-full text-sm forced-color-adjust-none [-webkit-tap-highlight-color:transparent]",
  variants: {
    isToday: {
      true: "relative after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-current",
    },
    isSelected: {
      false: [
        "text-gray-900 hover:bg-gray-200 pressed:bg-gray-300",
        "dark:text-gray-200 dark:hover:bg-gray-700 dark:pressed:bg-gray-600",
      ],
      true: [
        "bg-accent text-accent-fg invalid:bg-destructive hover:bg-accent-hover",
        "forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:invalid:bg-[Mark]",
      ],
    },
    isDisabled: {
      true: [
        "text-gray-300 dark:text-gray-600",
        "forced-colors:text-[GrayText]",
      ],
    },
  },
});

const CalendarCell = ({ className, ...props }: CalendarCellProps) => (
  <AriaCalendarCell
    {...props}
    className={composeRenderProps(className, (className, renderProps) =>
      calendarCellVariants({ className, ...renderProps }),
    )}
  />
);

type CalendarProps<T extends DateValue> = Omit<
  AriaCalendarProps<T>,
  "visibleDuration"
> & { errorMessage?: string };

const Calendar = <T extends DateValue>({
  errorMessage,
  ...props
}: CalendarProps<T>) => {
  return (
    <AriaCalendar
      {...props}
      className={composeTailwindRenderProps(props.className, [
        "@container flex w-[calc(--spacing(9)*7)] max-w-full flex-col",
      ])}
    >
      <CalendarHeader />
      <CalendarGrid>
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </AriaCalendar>
  );
};

type CalendarHeaderProps = Omit<ComponentPropsWithRef<"header">, "children">;

const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  const { direction } = useLocale();
  const PreviousIcon = direction === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = direction === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <header
      className={cn("flex items-center gap-1 px-1 pb-4", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon-xs"
        className="hover:bg-gray-200 dark:hover:bg-gray-700"
        slot="previous"
      >
        <PreviousIcon aria-hidden size={18} />
      </Button>
      <Heading className="mx-2 my-0 flex-1 text-center text-base font-semibold text-fg-boldest [font-variation-settings:normal]" />
      <Button
        variant="ghost"
        size="icon-xs"
        className="hover:bg-gray-200 dark:hover:bg-gray-700"
        slot="next"
      >
        <NextIcon aria-hidden size={18} />
      </Button>
    </header>
  );
};

type CalendarGridHeaderProps = Omit<
  ComponentPropsWithRef<typeof AriaCalendarGridHeader>,
  "children"
>;

const CalendarGridHeader = (props: CalendarGridHeaderProps) => {
  return (
    <AriaCalendarGridHeader {...props}>
      {(day) => (
        <CalendarHeaderCell className="text-xs font-semibold text-gray-500">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
};

export {
  Calendar,
  type CalendarProps,
  CalendarHeader,
  type CalendarHeaderProps,
  CalendarGridHeader,
  type CalendarGridHeaderProps,
  CalendarCell,
  type CalendarCellProps,
  calendarCellVariants,
};
