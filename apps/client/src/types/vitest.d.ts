import type { Locator, LocatorSelectors } from "vitest/browser";

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByTerm(term: string): Locator;
  }
}
