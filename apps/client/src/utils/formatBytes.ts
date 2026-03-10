/**
 * @file Functions to format bytes into human-readable strings using
 * Intl.NumberFormat. A lot of implementations use some kind of number division
 * and modulo to determine the appropriate unit, but this is more flexible
 * depending on locale.
 *
 * Since each unit multiple is considered a separate unit, we have to manually
 * determine the appropriate unit and corresponding value, otherwise we get
 * formatting such as "1 BB" instead of "1 GB".
 */

/**
 * Valid byte units supported by the `Intl.NumberFormat` API
 *
 * @see {@link https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers}
 */
const UNITS = [
  "byte",
  "kilobyte",
  "megabyte",
  "gigabyte",
  "terabyte",
  "petabyte",
] as const;

// SI units, where 1 gigabyte = 1000 megabytes
export const formatBytes = (
  bytes: number,
  ...[locales, options]: ConstructorParameters<Intl.NumberFormatConstructor>
): string => {
  const exponent =
    // 0 becomes -Infinity, nonfinite numbers cannot index `UNITS`
    bytes !== 0 && Number.isFinite(bytes) ?
      // Set to max unit (petabyte) if exponent exceeds largest unit
      Math.min(Math.floor(Math.log10(bytes) / 3), UNITS.length - 1)
    : 0; // Defaults to unit "byte"

  const value = bytes / 1000 ** exponent;

  return new Intl.NumberFormat(locales, {
    style: "unit",
    unit: UNITS[exponent],
    ...options,
  }).format(value);
};
