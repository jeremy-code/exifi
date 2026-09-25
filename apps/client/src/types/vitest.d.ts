// oxlint-disable-next-line import/no-unassigned-import
import "vitest/browser";
import type { Locator } from "vitest/browser";

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByTerm(term: string): Locator;
  }
}
