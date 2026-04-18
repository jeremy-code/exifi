const formatList = (
  list: Iterable<string>,
  locales?: Intl.LocalesArgument,
  options?: Intl.ListFormatOptions,
) => {
  const listFormat = new Intl.ListFormat(locales, options);

  return listFormat.format(list);
};

export { formatList };
