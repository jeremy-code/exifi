const arrayEquals = (value1: unknown[], value2: unknown[]) =>
  value1.length === value2.length &&
  value1.every((val, index) => Object.is(val, value2[index]));

export { arrayEquals };
