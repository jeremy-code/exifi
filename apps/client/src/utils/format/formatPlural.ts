import { NumberFormatter } from "@internationalized/number";
import { isRTL } from "react-aria-components/I18nProvider";

type PluralRules = {
  other: string;
} & Partial<Record<Intl.LDMLPluralRule, string>>;

const formatPlural = (
  num: number,
  pluralRules: PluralRules,
  locales?: Intl.LocalesArgument,
  options?: Intl.PluralRulesOptions & Intl.NumberFormatOptions,
) => {
  const pluralRulesInstance = new Intl.PluralRules(locales, options);
  const resolvedLocale = pluralRulesInstance.resolvedOptions().locale;
  const numberFormatter = new NumberFormatter(resolvedLocale, options);

  const suffix =
    pluralRules[pluralRulesInstance.select(num)] ?? pluralRules.other ?? "";

  return isRTL(resolvedLocale)
    ? `${suffix}${numberFormatter.format(num)}`
    : `${numberFormatter.format(num)}${suffix}`;
};

export { formatPlural, type PluralRules };
