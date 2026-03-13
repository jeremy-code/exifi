type PluralRules = Partial<Record<Intl.LDMLPluralRule, string>> &
  Record<"other", string>;

const formatPlural = (
  num: number,
  rules: PluralRules,
  ...[locales, options]: ConstructorParameters<Intl.PluralRulesConstructor>
) => {
  const suffix =
    rules[new Intl.PluralRules(locales, options).select(num)] ?? rules.other;

  // Options are not passed to `toLocaleString` and using the shared parameters
  // of Intl.PluralRules. Feel free to add as an parameter if needed.
  return `${num.toLocaleString(locales, options)}${suffix ?? ""}`;
};

export { formatPlural, type PluralRules };
