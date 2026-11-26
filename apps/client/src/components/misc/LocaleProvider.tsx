import { type ReactNode } from "react";

import { I18nProvider } from "react-aria/I18nProvider";
import * as z from "zod";
import * as zodLocales from "zod/locales";

import { type Locale, getLocale } from "#paraglide/runtime";

const ZOD_LOCALES = {
  en: zodLocales.en,
  de: zodLocales.de,
  es: zodLocales.es,
  fr: zodLocales.fr,
  ja: zodLocales.ja,
} satisfies Record<Locale, () => { localeError: z.core.$ZodErrorMap }>;

const LocaleProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const locale = getLocale();
  z.config(ZOD_LOCALES[locale]());

  return <I18nProvider locale={locale}>{children}</I18nProvider>;
};

export { LocaleProvider };
