/**
 * Enforces that a value is never reached (e.g. in a switch statement). Useful
 * for exhaustiveness.
 */
export function assertNever(value: never, message?: string): never {
  // JSON.stringify is not perfect, such as for Map, Set, but works for most
  // cases, and avoids issues working with `never`
  throw new Error(message ?? `Unexpected value: ${JSON.stringify(value)}`);
}
