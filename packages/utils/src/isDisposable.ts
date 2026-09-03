const isDisposable = (value: unknown): value is Disposable =>
  typeof value === "object" &&
  value !== null &&
  Symbol.dispose in value &&
  typeof value[Symbol.dispose] === "function";

export { isDisposable };
