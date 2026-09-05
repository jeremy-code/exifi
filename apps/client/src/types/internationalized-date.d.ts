// oxlint-disable-next-line import/no-unassigned-import
import "@internationalized/date";

declare module "@internationalized/date" {
  type FormattableTemporalObject = Intl.FormattableTemporalObject;

  interface DateFormatter {
    format(value?: FormattableTemporalObject | Date | number): string;
    formatToParts(
      value?: FormattableTemporalObject | Date | number,
    ): Intl.DateTimeFormatPart[];
    formatRange(
      start: FormattableTemporalObject | Date | number,
      end: FormattableTemporalObject | Date | number,
    ): string;
    formatRangeToParts(
      start: FormattableTemporalObject | Date | number,
      end: FormattableTemporalObject | Date | number,
    ): Intl.DateTimeRangeFormatPart[];
  }
}
